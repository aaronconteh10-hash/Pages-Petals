// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const sideMenu = document.getElementById("sideMenu");
const menuOverlay = document.getElementById("menuOverlay");

if (menuBtn) {
  menuBtn.onclick = () => {
    sideMenu.style.right = "0";
    menuOverlay.style.display = "block";
  };
}

if (menuOverlay) {
  menuOverlay.onclick = () => {
    sideMenu.style.right = "-250px";
    menuOverlay.style.display = "none";
  };
}

// Payment inputs
const cardInput = document.getElementById("cardNumber");
const expMonthInput = document.getElementById("expMonth");
const expYearInput = document.getElementById("expYear");
const cvvInput = document.getElementById("cvv");

// Format card number
if (cardInput) {
  cardInput.addEventListener("input", () => {
    let v = cardInput.value.replace(/\D/g, "").slice(0, 16);
    cardInput.value = v.replace(/(.{4})/g, "$& ").trim();
  });
}

// Limit month/year inputs
if (expMonthInput) {
  expMonthInput.addEventListener("input", () => {
    expMonthInput.value = expMonthInput.value.replace(/\D/g, "").slice(0, 2);
  });
}

if (expYearInput) {
  expYearInput.addEventListener("input", () => {
    expYearInput.value = expYearInput.value.replace(/\D/g, "").slice(0, 4);
  });
}

// Form submit
const form = document.getElementById("paymentForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const msg = document.getElementById("message");
    msg.textContent = "";

    const card = cardInput.value.replace(/\s/g, "");
    const month = parseInt(expMonthInput.value);
    const year = parseInt(expYearInput.value);
    const cvv = cvvInput.value.trim();
    const now = new Date();

    const validCard = /^5[1-5]\d{14}$/.test(card);
    const validCVV = /^[0-9]{3,4}$/.test(cvv);
    const validExpiry =
      month >= 1 &&
      month <= 12 &&
      (year > now.getFullYear() ||
        (year === now.getFullYear() && month >= now.getMonth() + 1));

    if (!validCard || !validCVV || !validExpiry) {
      msg.textContent = "Check your details.";
      msg.style.color = "red";
      return;
    }

    const payload = {
      master_card: card,
      exp_month: month,
      exp_year: year,
      cvv_code: cvv
    };
     if (cvvInput) {
  cvvInput.addEventListener("input", () => {
    cvvInput.value = cvvInput.value.replace(/\D/g, "").slice(0, 4);
  });
}

    try {
      const res = await fetch("https://mudfoot.doc.stu.mmu.ac.uk/node/api/creditcard", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload)
      });

      const text = await res.text();
      console.log(text);

      if (!res.ok) {
        msg.textContent = "Payment failed.";
        msg.style.color = "red";
        return;
      }

      msg.textContent = "Payment successful!";
      msg.style.color = "green";

      sessionStorage.setItem("last4", card.slice(-4));

      setTimeout(() => {
        window.location.href = "success.html";
      }, 1200);

    } catch (err) {
      msg.textContent = "Network error.";
      msg.style.color = "red";
    }
  });
}

// Success page last 4 digits
const lastDigits = document.getElementById("lastDigits");
if (lastDigits) {
  const last4 = sessionStorage.getItem("last4");
  if (last4) {
    lastDigits.textContent = "**** **** **** " + last4;
  }
}
