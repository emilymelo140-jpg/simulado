let usuarioAtivo = null;

document.addEventListener("DOMContentLoaded", () => {
    carregarPublicacoes();
});

function verificarAutenticacao(event) {
    if (!usuarioAtivo) {
        if (event) event.target.blur();
        abrirModalLogin();
        return false;
    }

    return true;
}

function abrirModalLogin() {
    document.getElementById("modal-login").style.display = "flex";
}

function fecharModalLogin() {
    document.getElementById("modal-login").style.display = "none";
    limparErrosLogin();
}

function toggleMenu() {
    document.getElementById("menu-lateral").classList.toggle("aberto");
}

function limparErrosLogin() {
    document.getElementById("erro-email").innerText = "";
    document.getElementById("erro-senha").innerText = "";
    document.getElementById("erro-credenciais").innerText = "";
}

async function efetuarLogin() {
    limparErrosLogin();

    const email = document.getElementById("login-email").value;
    const senha = document.getElementById("login-senha").value;

    let valido = true;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById("erro-email").innerText =
            "E-mail inválido ou vazio.";

        valido = false;
    }

    if (!senha) {
        document.getElementById("erro-senha").innerText =
            "A senha é obrigatória e não pode estar vazia.";

        valido = false;
    }

    if (!valido) return;

    try {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, senha })
        });

        if (res.ok) {
            const data = await res.json();

            usuarioAtivo = data.user;

            fecharModalLogin();
            atualizarInterface();
        } else {
            document.getElementById("erro-credenciais").innerText =
                "Usuário não encontrado ou senha incorreta.";
        }
    } catch (err) {
        console.error("Erro na autenticação:", err);
    }
}

function efetuarLogout() {
    usuarioAtivo = null;

    toggleMenu();
    atualizarInterface();
}