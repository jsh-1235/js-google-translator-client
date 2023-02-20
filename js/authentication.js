import { CLIENT_ID, API_KEY, DISCOVERY_DOC as DISCOVERY_DOCS, SCOPE } from "./keys.js";

export default class Authentication {
  constructor(writer) {
    this.writer = writer;

    this.client = null;

    this.initialize = this.initialize.bind(this);

    this.authorize = this.authorize.bind(this);

    this.getCookie = this.getCookie.bind(this);

    this.login = this.login.bind(this);

    this.logout = this.logout.bind(this);
  }

  initialize() {
    window.gapi.load("client", this.authorize);

    document.getElementById("login").addEventListener("click", (e) => {
      console.log(e.target.dataset.role);

      if (e.target.dataset.role === "login") {
        this.login();
      } else {
        this.logout();
      }
    });
  }

  async authorize() {
    await window.gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOCS],
    });

    this.client = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPE,
      callback: "", // defined later
    });

    console.log("client", this.client);

    if (!window.gapi.client.getToken()) {
      const cookie = this.getCookie("access_token");

      if (cookie) {
        window.gapi.client.setToken({ access_token: cookie });

        document.getElementById("login").dataset.role = "logout";
        document.getElementById("login").classList.add("logout");
        document.getElementById("login").innerText = " logout";
      }

      this.writer.getValues(undefined, "A1:Z100", (rows) => {
        console.log(rows);
      });
    }
  }

  getCookie(cname) {
    let name = cname + "=";

    let decodedCookie = decodeURIComponent(document.cookie);

    let items = decodedCookie.split(";");

    for (let i = 0; i < items.length; i++) {
      let item = items[i];

      while (item.charAt(0) == " ") {
        item = item.substring(1);
      }

      if (item.indexOf(name) == 0) {
        return item.substring(name.length, item.length);
      }
    }

    return "";
  }

  login() {
    this.client.callback = async (response) => {
      if (response.error !== undefined) {
        throw response;
      }

      console.log("login");

      console.log(response);

      document.cookie = `access_token=${response.access_token}; SameSite=None; Secure`;

      document.getElementById("login").dataset.role = "logout";
      document.getElementById("login").classList.add("logout");
      document.getElementById("login").innerText = " logout";

      console.log(this.client);
    };

    if (window.gapi.client.getToken() === null) {
      this.client.requestAccessToken({ prompt: "consent" });
    } else {
      this.client.requestAccessToken({ prompt: "" });
    }
  }

  logout() {
    const token = window.gapi.client.getToken();

    if (token !== null) {
      console.log("logout");

      window.google.accounts.oauth2.revoke(token.access_token);

      window.gapi.client.setToken("");

      document.cookie = "access_token=";

      document.getElementById("login").dataset.role = "login";
      document.getElementById("login").classList.remove("logout");
      document.getElementById("login").innerText = " login";
    }
  }
}
