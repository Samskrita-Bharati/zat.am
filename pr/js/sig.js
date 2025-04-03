let domain = "";
let yr = 00;
$("#if").hide();
var openyrs = ["1994","1995","1996","1997","1998","1999"];
function parseJwt(token) {
    try {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.log("some error?");
        return "err";
    } finally {
        console.log("Everything has been handled");
    }
}
var emls = ["toronto@samskritabharatiusa.org",
    "deeshat@samskritabharatiusa.org",
    "karthikv@samskritabharatiusa.org",
    "harsht@samskritabharatiusa.org","artik@samskritabharatiusa.org","aniketk@samskritabharatiusa.org",
    "vi.raama@gmail.com",
    "amrutputra@gmail.com",
    "samskritam@gmail.com",
	"nalinyvasan@gmail.com",
	"subramaniann@samskritabharatiusa.org","radhiradhi@gmail.com"
];
function handleCredentialResponse(response) {
    sessionStorage.setItem("pml", response.credential);
}
function showit()
{
	$("#list").hide();
	$("#if").show();
	$("h1.title")[0].innerHTML = Sanscript.t(yr, 'itrans', 'devanagari');
	if (yr == 1998)
		$("#if iframe")[0].src = "https://amuselabs.com/pmm/date-picker?set=" + "sanskritbharatiusa-pa%20199&embed=1";
		else
	$("#if iframe")[0].src = "https://amuselabs.com/pmm/date-picker?set=" + "sanskritbharatiusa-pa" + yr + "&embed=1";
}
if (/year=(\w+)/.exec(window.location.href))
    yr = /year=(\w+)/.exec(window.location.href)[1];
if (yr > 1993 && yr < 2023) {
    //domain=responsePayload.hd;
    //domain=userProfile.email.substring(userProfile.email.lastIndexOf('@')+1);
    if (openyrs.includes(yr)) {
		showit();
    }
    else {
        const responsePayload = parseJwt(sessionStorage.getItem("pml"));
        if (emls.includes(responsePayload.email)) {
			showit();
        } else {
            $("#if iframe")[0].src = "img/pr23-v2.png";
            alert("currently in BETA ... email to pr@samskritabharati.ca ");
        }
    }
}