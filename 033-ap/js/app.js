let domain="";
let yr=00;
if ( /year=(\w+)/.exec(window.location.href))
	yr=/year=(\w+)/.exec(window.location.href)[1];
$("#if").hide();
auth0.createAuth0Client({
  domain: "dev-dh04orol28atnr8w.us.auth0.com",
  clientId: "a741tuzFIBpSXpSghajwt4rBUkMu0zaC",
  authorizationParams: {
    redirect_uri: window.location.origin
  }
}).then(async (auth0Client) => {
  // Assumes a button with id "login" in the DOM
  const loginButton = document.getElementById("login");

  loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    auth0Client.loginWithRedirect();
  });

  if (location.search.includes("state=") && 
      (location.search.includes("code=") || 
      location.search.includes("error="))) {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/");
  }

  // Assumes a button with id "logout" in the DOM
  const logoutButton = document.getElementById("logout");

  logoutButton.addEventListener("click", (e) => {
    e.preventDefault();
    auth0Client.logout();
  });

  const isAuthenticated = await auth0Client.isAuthenticated();
  const userProfile = await auth0Client.getUser();

  // Assumes an element with id "profile" in the DOM
  const profileElement = document.getElementById("profile");

  if (isAuthenticated) {
    profileElement.style.display = "block";
    profileElement.innerHTML = `
            <p>${userProfile.name}</p>
          `;
		domain=userProfile.email.substring(userProfile.email.lastIndexOf('@')+1);
		if ( domain == "samskritabharatiusa.org")
		{
			if (yr > 1994 && yr < 2023)
			{
			$("#list").hide();
			$("#if").show();
			$("h1.title")[0].innerHTML=Sanscript.t(yr,'itrans','devanagari');
			$("iframe")[0].src="https://amuselabs.com/pmm/date-picker?set="+"sanskritbharatiusa-pa"+yr+"&embed=1";
			}
		}
		
  } else {
    profileElement.style.display = "none";
  }
});
