/*
 * Embeds the 1mind Superhuman (Mindy, inbound deployment 5p8mzntch9) on the
 * docs site, replacing Mintlify's native AI assistant.
 *
 * Mintlify includes any .js file in the content directory (the folder holding
 * docs.json) on every page and runs it after the page becomes interactive.
 * The launcher is injected once per visit; Mintlify swaps pages client-side
 * without a full reload, so the widget persists across navigation and does not
 * need to be re-injected. The guard below prevents a duplicate launcher if this
 * script ever runs more than once.
 */
(function () {
  var LAUNCHER_SRC = 'https://launcher.1mind.com/deployment-5p8mzntch9';

  if (document.querySelector('script[src="' + LAUNCHER_SRC + '"]')) {
    return;
  }

  var script = document.createElement('script');
  script.src = LAUNCHER_SRC;
  script.async = true;
  script.setAttribute('data-deployment', '5p8mzntch9');
  document.head.appendChild(script);
})();
