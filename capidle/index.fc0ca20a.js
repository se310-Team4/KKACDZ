class t extends HTMLElement{constructor(){super(),null===this.getAttribute("custom")&&(this.innerHTML=`\n      <div><a href="../index.html">⬅️</a></div>\n      <div>${this.innerHTML}</div>\n      <div id="help-btn"><a href="#">❔</a></div>\n    `)}}window.customElements.define("core-navbar",t);class e extends HTMLElement{constructor(){super(),this.innerHTML=`\n\t\t\t<div>\n\t\t\t\t<div id="modal">\n\t\t\t\t\t<div class="modal-window">\n\t\t\t\t\t\t<span id="close-btn">&times;</span>\n\t\t\t\t\t\t<div>${this.innerHTML}</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t`,this.registerEventListeners()}registerEventListeners(){const t=document.getElementById("modal"),e=document.getElementById("help-btn");function n(t){"Escape"===t.key&&i()}function i(){t.style.display="none",document.removeEventListener("keydown",n),localStorage["seen-modal-"+location]=!0,document.dispatchEvent(new Event("modal-closed"))}function d(){t.style.display="block",document.addEventListener("keydown",n),document.dispatchEvent(new Event("modal-opened"))}document.getElementById("close-btn").onclick=i,e.onclick=d,window.onclick=function(e){e.target==t&&i()},t.style.display="none",localStorage["seen-modal-"+location]||d()}}window.customElements.define("core-modal",e);
//# sourceMappingURL=index.fc0ca20a.js.map
