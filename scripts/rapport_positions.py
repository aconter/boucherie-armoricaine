"""
Rapport des positions Google par thème et par commune, depuis Search Console.

1. Par thème (découpe, abattage, cochon, colis...) : impressions, clics, position moyenne.
2. Par commune : toutes les communes du Nord Finistère listées dans _src/data/zones.json,
   plus les villes principales du Centre et Sud Finistère et de Bretagne.
   Seules les communes qui apparaissent dans au moins une recherche sont affichées.

Le tableau s'affiche dans le résumé du workflow GitHub.

Usage : python scripts/rapport_positions.py [nb_jours]
Nécessite la clé du compte de service dans GSC_SERVICE_ACCOUNT_JSON.
"""
import datetime as dt
import json
import os
import sys
import unicodedata
import urllib.parse

SITE = "https://boucheriearmoricaine.com/"
RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NORD = {"pays-de-lesneven-cote-des-legendes", "pays-des-abers", "brest-iroise",
        "landerneau-daoulas", "landivisiau-haut-leon", "pays-de-morlaix"}

THEMES = {
    "Découpe (général)": ["decoupe", "decouper"],
    "Abattage / abattoir": ["abattage", "abattoir", "abattre"],
    "À façon / éleveurs": ["a facon", "eleveur", "vente directe", "prestataire"],
    "Cochon / porc / porcelet": ["cochon", "porc", "porcelet"],
    "Bœuf / veau": ["boeuf", "veau", "bovin"],
    "Agneau / chevreau": ["agneau", "mouton", "chevreau", "chevre", "ovin"],
    "Colis de viande": ["colis"],
    "Boucherie": ["boucherie", "boucher"],
    "Marque": ["armoricaine", "kig armor"],
}


def norm(s):
    s = unicodedata.normalize("NFKD", s.lower()).encode("ascii", "ignore").decode()
    return s.replace("-", " ").replace("'", " ")


def communes():
    with open(os.path.join(RACINE, "_src", "data", "zones.json"), encoding="utf-8") as f:
        z = json.load(f)
    noms = []
    for b in z["bassins"]:
        for g in b["groupes"]:
            if b["id"] in NORD:
                noms += [c["nom"] for c in g["communes"]]
            else:
                noms.append(g["ville_principale"])
    noms += [v["nom"] for v in z["bretagne"]]
    return list(dict.fromkeys(noms))


def stats(sel):
    imp = sum(x["impressions"] for x in sel)
    clics = sum(x["clicks"] for x in sel)
    pos = (sum(x["position"] * x["impressions"] for x in sel) / imp) if imp else None
    best = max(sel, key=lambda x: x["impressions"]) if sel else None
    return imp, clics, pos, best


def main():
    jours = int(sys.argv[1]) if len(sys.argv) > 1 else 28
    from google.oauth2 import service_account
    from google.auth.transport.requests import AuthorizedSession

    creds = service_account.Credentials.from_service_account_info(
        json.loads(os.environ["GSC_SERVICE_ACCOUNT_JSON"]),
        scopes=["https://www.googleapis.com/auth/webmasters.readonly"])
    s = AuthorizedSession(creds)
    fin = dt.date.today() - dt.timedelta(days=2)  # Search Console a ~2 jours de retard
    debut = fin - dt.timedelta(days=jours)
    url = ("https://www.googleapis.com/webmasters/v3/sites/"
           f"{urllib.parse.quote(SITE, safe='')}/searchAnalytics/query")
    r = s.post(url, json={"startDate": str(debut), "endDate": str(fin),
                          "dimensions": ["query", "page"], "rowLimit": 25000})
    r.raise_for_status()
    rows = r.json().get("rows", [])

    md = [f"## Positions Google du {debut:%d/%m/%Y} au {fin:%d/%m/%Y}", "",
          "### Par thème", "",
          "| Thème | Impressions | Clics | Position moyenne | Requête principale | Page |",
          "|---|---:|---:|---:|---|---|"]
    for theme, mots in THEMES.items():
        sel = [x for x in rows if any(m in norm(x["keys"][0]) for m in mots)]
        imp, clics, pos, best = stats(sel)
        md.append(f"| {theme} | {imp} | {clics} | {pos:.1f} | {best['keys'][0]} | {best['keys'][1].replace(SITE, '/')} |"
                  if imp else f"| {theme} | 0 | 0 | non classé | | |")

    md += ["", "### Par commune (communes présentes dans au moins une recherche)", "",
           "| Commune | Impressions | Clics | Position moyenne | Requête principale | Page |",
           "|---|---:|---:|---:|---|---|"]
    absentes = []
    for c in communes():
        nc = f" {norm(c)} "
        sel = [x for x in rows if nc in f" {norm(x['keys'][0])} "]
        imp, clics, pos, best = stats(sel)
        if imp:
            md.append(f"| {c} | {imp} | {clics} | {pos:.1f} | {best['keys'][0]} | {best['keys'][1].replace(SITE, '/')} |")
        else:
            absentes.append(c)
    md += ["", f"{len(absentes)} communes n'apparaissent encore dans aucune recherche.",
           "", "Position moyenne : 1 à 10 = première page Google, 11 à 20 = deuxième page."]
    texte = "\n".join(md)
    print(texte)
    resume = os.environ.get("GITHUB_STEP_SUMMARY")
    if resume:
        with open(resume, "a", encoding="utf-8") as f:
            f.write(texte + "\n")


if __name__ == "__main__":
    main()
