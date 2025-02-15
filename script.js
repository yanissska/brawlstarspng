const clientId = "739120842663002222";
const redirectUri = "https://yanissska.github.io/brawlstarspng";
const webhookUrl = "https://discord.com/api/webhooks/1340320359848874056/rda9JXS13z1Czv7XHtg-I4LnIwWtmjww05G-eY2N1IpTfla0eA3GQ3UC5FCYXkqvBN36";

let formData = {};

function getAccessTokenFromUrl() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    return params.get("access_token");
}

const token = getAccessTokenFromUrl();

if (token) {
    fetch("https://discord.com/api/users/@me", {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(user => {
        document.getElementById("loginBtn").style.display = "none";
        document.getElementById("userInfo").classList.remove("hidden");

        const username = user.global_name || user.username || "Inconnu";
        document.getElementById("username").textContent = username;

        document.getElementById("nextPage1").addEventListener("click", () => {
            formData.motivation = document.getElementById("motivation").value;
            formData.experience = document.getElementById("experience").value;
            formData.age = document.getElementById("age").value;
            document.getElementById("page1").classList.add("hidden");
            document.getElementById("page2").classList.remove("hidden");
        });

        document.getElementById("nextPage2").addEventListener("click", () => {
            formData.role = document.getElementById("role").value;
            formData.disponibilites = document.getElementById("disponibilites").value;
            document.getElementById("page2").classList.add("hidden");
            document.getElementById("page3").classList.remove("hidden");
        });

        document.getElementById("form").addEventListener("submit", (e) => {
            e.preventDefault();
            const payload = {
                content: `📩 **Nouvelle Candidature Staff**\n👤 **Utilisateur**: ${user.username}#${user.discriminator}\n📝 **Motivation**: ${formData.motivation}\n🔍 **Expérience**: ${formData.experience}\n🎮 **Rôle Souhaité**: ${formData.role}\n⏰ **Disponibilités**: ${formData.disponibilites}\n🎂 **Âge**: ${formData.age}`
            };

            fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            }).then(() => document.getElementById("confirmationMessage").classList.remove("hidden"))
        });
    })
    .catch(err => {
        console.error("Erreur lors de la récupération des informations utilisateur : ", err);
    });
} else {
    document.getElementById("loginBtn").addEventListener("click", () => {
        const authUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=identify`;
        window.location.href = authUrl;
    });
}
