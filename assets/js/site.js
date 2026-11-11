// Boucherie Armoricaine : menu mobile et formulaires.
(function () {
  'use strict';

  // ---------- Menu ----------
  var bouton = document.querySelector('.menu-bouton');
  var nav = document.getElementById('menu-principal');
  if (bouton && nav) {
    var fermer = function () {
      nav.classList.remove('ouvert');
      bouton.setAttribute('aria-expanded', 'false');
    };
    bouton.addEventListener('click', function () {
      var ouvert = nav.classList.toggle('ouvert');
      bouton.setAttribute('aria-expanded', String(ouvert));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('ouvert')) {
        fermer();
        bouton.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('ouvert') && !nav.contains(e.target) && !bouton.contains(e.target)) fermer();
    });
  }

  // ---------- Formulaires ----------
  var MESSAGES = {
    valueMissing: 'Ce champ est obligatoire.',
    typeMismatch: 'Le format n’est pas valide. Exemple : nom@exemple.fr',
    patternMismatch: 'Indiquez un numéro de téléphone à 10 chiffres. Exemple : 06 12 34 56 78',
    tooLong: 'Ce texte est trop long.',
  };

  function messageErreur(champ) {
    var v = champ.validity;
    for (var cle in MESSAGES) {
      if (v[cle]) return MESSAGES[cle];
    }
    return v.valid ? '' : 'Vérifiez ce champ.';
  }

  function afficher(champ) {
    var zone = document.getElementById(champ.id + '-erreur');
    var msg = messageErreur(champ);
    if (zone) {
      zone.textContent = msg;
      zone.hidden = !msg;
    }
    if (msg) {
      champ.setAttribute('aria-invalid', 'true');
      var desc = (champ.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      if (desc.indexOf(champ.id + '-erreur') === -1) desc.push(champ.id + '-erreur');
      champ.setAttribute('aria-describedby', desc.join(' '));
    } else {
      champ.removeAttribute('aria-invalid');
    }
    return !msg;
  }

  document.querySelectorAll('form.formulaire').forEach(function (form) {
    var champs = form.querySelectorAll('input:not([type=hidden]):not([name=_gotcha]), select, textarea');
    var statut = form.querySelector('.form-statut');
    var envoyer = form.querySelector('button[type=submit]');

    champs.forEach(function (c) {
      c.addEventListener('blur', function () { if (c.value) afficher(c); });
      c.addEventListener('input', function () { if (c.getAttribute('aria-invalid')) afficher(c); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var premier = null;
      champs.forEach(function (c) {
        if (!afficher(c) && !premier) premier = c;
      });
      if (premier) {
        statut.className = 'form-statut ko';
        statut.textContent = 'Le formulaire contient des erreurs. Corrigez les champs signalés.';
        premier.focus();
        return;
      }
      // Champ piège rempli : robot probable, on n'envoie rien.
      var piege = form.querySelector('[name=_gotcha]');
      if (piege && piege.value) return;

      envoyer.disabled = true;
      statut.className = 'form-statut';
      statut.textContent = 'Envoi en cours…';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          form.reset();
          statut.className = 'form-statut ok';
          statut.textContent = 'Demande envoyée. Nous vous recontactons dès que possible. Pour une réponse immédiate, appelez le 02 98 21 08 99.';
        })
        .catch(function () {
          statut.className = 'form-statut ko';
          statut.textContent = 'L’envoi a échoué. Réessayez, ou appelez-nous au 02 98 21 08 99.';
        })
        .then(function () {
          envoyer.disabled = false;
        });
    });
  });
})();
