"""Calcule les distances routières entre l'atelier et les communes.

Sources :
- Communes, communautés de communes, coordonnées du centre : geo.api.gouv.fr (API officielle).
- Itinéraires routiers : serveur de démonstration OSRM (données OpenStreetMap, licence ODbL).

Usage (à relancer seulement si la liste des zones change) :
    python -I _src/outils/calcul-distances.py
Écrit _src/data/zones.json, lu par le générateur. Aucune donnée personnelle n'est envoyée.
"""
import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

ATELIER = (-4.31892, 48.57755)  # lon, lat : 23 rue d'Arvor, Lesneven
GEO = "https://geo.api.gouv.fr"
OSRM = "https://router.project-osrm.org"
UA = {"User-Agent": "site-boucherie-calcul-distances/1.0"}
SORTIE = Path(__file__).resolve().parents[1] / "data" / "zones.json"

# Bassins = communautés de communes (codes SIREN officiels).
BASSINS = [
    {"id": "pays-de-lesneven-cote-des-legendes", "epcis": ["242900793"]},
    {"id": "pays-des-abers", "epcis": ["242900553"]},
    {"id": "brest-iroise", "epcis": ["242900314", "242900074"]},
    {"id": "landerneau-daoulas", "epcis": ["242900801"]},
    {"id": "landivisiau-haut-leon", "epcis": ["242900751", "200067072"]},
    {"id": "pays-de-morlaix", "epcis": ["242900835"]},
    {"id": "centre-et-sud-finistere", "epcis": [
        "200067197", "200066868", "200067247", "242900744", "242900561",
        "200068120", "242900645", "242900629", "242900710", "242900702",
        "242900660", "242900769", "242900694",
    ]},
]
VILLES_BRETAGNE = ["Saint-Brieuc", "Lannion", "Guingamp", "Paimpol", "Dinan", "Loudéac",
                   "Rostrenen", "Pontivy", "Lorient", "Vannes"]


def get(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def communes_epci(code):
    data = get(f"{GEO}/epcis/{code}/communes?fields=nom,code,centre,population&format=json")
    nom = get(f"{GEO}/epcis/{code}?fields=nom")["nom"]
    return nom, data


def ville(nom):
    q = urllib.parse.urlencode({"nom": nom, "fields": "nom,code,codeDepartement,centre,population",
                                "boost": "population", "limit": 1})
    return get(f"{GEO}/communes?{q}")[0]


def table(points):
    """Distances et durées depuis l'atelier, par lots de 90 destinations."""
    res = []
    for i in range(0, len(points), 90):
        lot = points[i:i + 90]
        coords = ";".join(f"{lon},{lat}" for lon, lat in [ATELIER, *lot])
        url = f"{OSRM}/table/v1/driving/{coords}?sources=0&annotations=duration,distance"
        d = get(url)
        if d.get("code") != "Ok":
            raise RuntimeError(d)
        res += list(zip(d["distances"][0][1:], d["durations"][0][1:]))
        time.sleep(1.5)
    return res


def routes_principales(lon, lat):
    """Routes numérotées empruntées (N12, D788...), dans l'ordre, depuis la ville vers l'atelier."""
    url = f"{OSRM}/route/v1/driving/{lon},{lat};{ATELIER[0]},{ATELIER[1]}?steps=true&overview=false"
    d = get(url)
    vues = []
    for step in d["routes"][0]["legs"][0]["steps"]:
        ref = step.get("ref", "")
        if step.get("distance", 0) < 2000 or not ref:
            continue
        for r in ref.split(";"):
            r = r.strip().replace(" ", "")
            if r and r not in vues and not r.startswith("E"):
                vues.append(r)
    time.sleep(1.5)
    return vues


def arrondi(m, s):
    return {"km": round(m / 1000), "min": max(5, round(s / 60 / 5) * 5)}


def main():
    sortie = {"source": "geo.api.gouv.fr (communes), OSRM / OpenStreetMap (itinéraires)",
              "calcule_le": time.strftime("%Y-%m-%d"), "bassins": [], "bretagne": []}
    for b in BASSINS:
        groupes = []
        for code in b["epcis"]:
            nom, coms = communes_epci(code)
            pts = [tuple(c["centre"]["coordinates"]) for c in coms]
            dist = table(pts)
            lignes = [{"nom": c["nom"], "insee": c["code"], "population": c.get("population", 0), **arrondi(m, s)}
                      for c, (m, s) in zip(coms, dist)]
            lignes.sort(key=lambda x: (x["min"], x["km"], x["nom"]))
            principale = max(coms, key=lambda c: c.get("population", 0))
            lon, lat = principale["centre"]["coordinates"]
            groupes.append({"epci": nom, "siren": code, "communes": lignes,
                            "ville_principale": principale["nom"], "routes": routes_principales(lon, lat)})
            print(b["id"], nom, len(lignes))
        sortie["bassins"].append({"id": b["id"], "groupes": groupes})
    for n in VILLES_BRETAGNE:
        v = ville(n)
        (m, s), = table([tuple(v["centre"]["coordinates"])])
        lon, lat = v["centre"]["coordinates"]
        sortie["bretagne"].append({"nom": v["nom"], "departement": v["codeDepartement"], **arrondi(m, s),
                                   "routes": routes_principales(lon, lat)})
        print(n)
    SORTIE.write_text(json.dumps(sortie, ensure_ascii=False, indent=1), encoding="utf-8")
    print("écrit", SORTIE)


if __name__ == "__main__":
    main()
