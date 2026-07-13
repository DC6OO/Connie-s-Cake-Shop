(function () {
  var PASTRY_ITEMS = [
    {
      id: "bento-2layer",
      name: "Bento 2Layer",
      price: 450,
      flavors: ["Vanilla", "Chocolate", "Red velvet", "Custom"],
    },
    {
      id: "bento-cuppies",
      name: "Bento 2Layer + 5 Cuppies",
      price: 600,
      flavors: ["Vanilla", "Chocolate", "Mixed", "Custom"],
    },
    {
      id: "small-6inch",
      name: "Small 6inch Cake",
      price: 750,
      flavors: ["Vanilla", "Chocolate", "Red velvet", "Custom"],
    },
    {
      id: "medium-7inch",
      name: "Medium 7inch Cake",
      price: 950,
      flavors: ["Vanilla", "Chocolate", "Red velvet", "Custom"],
    },
    {
      id: "large-8inch",
      name: "Large 8inch Cake",
      price: 1150,
      flavors: ["Vanilla", "Chocolate", "Red velvet", "Custom"],
    },
    {
      id: "two-layers",
      name: "2 Layers (5 and 7inch)",
      price: 1600,
      flavors: ["Vanilla", "Chocolate", "Mixed", "Custom"],
    },
    {
      id: "gloss-picture",
      name: "Gloss Picture",
      price: 100,
      flavors: ["Add-on"],
    },
    {
      id: "edible-picture",
      name: "Edible Picture",
      price: 150,
      flavors: ["Add-on"],
    },
    {
      id: "custom-topper",
      name: "Custom Topper",
      price: 150,
      flavors: ["Add-on"],
    },
    {
      id: "chocolates",
      name: "Chocolates",
      price: 350,
      flavors: ["Assorted"],
    },
    {
      id: "dummy-3tier",
      name: "Dummy 3 tier Cake",
      price: 1500,
      flavors: ["Display / props"],
    },
    {
      id: "samosa-frozen",
      name: "Samosa (Frozen ×5)",
      price: 45,
      flavors: ["Frozen pack"],
    },
    {
      id: "samosa-cooked",
      name: "Samosa (Cooked ×10)",
      price: 100,
      flavors: ["Cooked pack"],
    },
    {
      id: "spring-roll-frozen",
      name: "Spring Roll (Frozen ×5)",
      price: 50,
      flavors: ["Frozen pack"],
    },
    {
      id: "spring-roll-cooked",
      name: "Spring Roll (Cooked ×10)",
      price: 120,
      flavors: ["Cooked pack"],
    },
    {
      id: "sausage-roll-frozen",
      name: "Sausage roll (Frozen ×5)",
      price: 60,
      flavors: ["Frozen pack"],
    },
    {
      id: "sausage-roll-cooked",
      name: "Sausage roll (Cooked ×10)",
      price: 150,
      flavors: ["Cooked pack"],
    },
    {
      id: "russian-roll-frozen",
      name: "Russian Roll (Frozen ×5)",
      price: 60,
      flavors: ["Frozen pack"],
    },
    {
      id: "russian-roll-cooked",
      name: "Russian Roll (Cooked ×10)",
      price: 150,
      flavors: ["Cooked pack"],
    },
    {
      id: "mini-pizza-frozen",
      name: "Mini Pizza's (Frozen ×5)",
      price: 100,
      flavors: ["Frozen pack"],
    },
    {
      id: "mini-pizza-cooked",
      name: "Mini Pizza's (Cooked ×10)",
      price: 250,
      flavors: ["Cooked pack"],
    },
    {
      id: "pie-frozen",
      name: "Pie (Frozen ×5)",
      price: 125,
      flavors: ["Frozen pack"],
    },
    {
      id: "pie-cooked",
      name: "Pie (Cooked ×10)",
      price: 300,
      flavors: ["Cooked pack"],
    },
  ];

  var linesContainer = document.querySelector("[data-order-lines]");
  var template = document.getElementById("order-line-template");
  var addBtn = document.getElementById("add-pastry-line");
  var form = document.getElementById("pastry-order-form");
  var summaryList = document.querySelector("[data-summary-list]");
  var summaryEmpty = document.querySelector("[data-summary-empty]");
  var summaryTotalEl = document.querySelector("[data-summary-total]");
  var summaryTotalWrap = document.querySelector("[data-summary-total-wrap]");
  var toastEl = document.querySelector("[data-order-toast]");
  var ORDERS_STORAGE_KEY = "kaysBakeryOrders";

  if (!linesContainer || !template || !form) return;

  function formatMoney(n) {
    return "K" + Number(n).toLocaleString("en-ZM", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  function pastryById(id) {
    for (var i = 0; i < PASTRY_ITEMS.length; i++) {
      if (PASTRY_ITEMS[i].id === id) return PASTRY_ITEMS[i];
    }
    return PASTRY_ITEMS[0];
  }

  function fillPastrySelect(select) {
    select.innerHTML = "";
    var placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select item";
    placeholder.selected = true;
    placeholder.disabled = true;
    select.appendChild(placeholder);
    PASTRY_ITEMS.forEach(function (p) {
      var opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.name + " — " + formatMoney(p.price);
      select.appendChild(opt);
    });
  }

  function fillFlavorSelect(select, pastryId) {
    select.innerHTML = "";
    if (!pastryId) {
      var placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "Select flavor";
      placeholder.selected = true;
      placeholder.disabled = true;
      select.appendChild(placeholder);
      select.disabled = true;
      return;
    }
    select.disabled = false;
    var p = pastryById(pastryId);
    p.flavors.forEach(function (fl) {
      var opt = document.createElement("option");
      opt.value = fl;
      opt.textContent = fl;
      select.appendChild(opt);
    });
  }

  function wireLine(line) {
    var pastrySel = line.querySelector(".order-pastry");
    var flavorSel = line.querySelector(".order-flavor");
    var qtyInput = line.querySelector(".order-qty");

    function syncFlavors() {
      fillFlavorSelect(flavorSel, pastrySel.value);
      line.classList.toggle("has-choice", Boolean(pastrySel.value));
    }

    pastrySel.addEventListener("change", function () {
      syncFlavors();
      updateSummary();
    });
    flavorSel.addEventListener("change", updateSummary);
    qtyInput.addEventListener("input", updateSummary);
    qtyInput.addEventListener("change", updateSummary);

    syncFlavors();
  }

  function addLine() {
    var node = template.content.querySelector("[data-order-line]").cloneNode(true);
    var pastrySel = node.querySelector(".order-pastry");
    fillPastrySelect(pastrySel);
    fillFlavorSelect(node.querySelector(".order-flavor"), "");
    linesContainer.appendChild(node);
    wireLine(node);
    updateSummary();
  }

  function collectOrderLines() {
    var rows = linesContainer.querySelectorAll("[data-order-line]");
    var items = [];
    var total = 0;

    rows.forEach(function (line) {
      var pastrySel = line.querySelector(".order-pastry");
      var flavorSel = line.querySelector(".order-flavor");
      var qtyInput = line.querySelector(".order-qty");
      var id = pastrySel.value;
      if (!id) return;
      var p = pastryById(id);
      var qty = parseInt(qtyInput.value, 10);
      if (isNaN(qty) || qty < 1) qty = 1;
      var lineTotal = p.price * qty;
      total += lineTotal;
      items.push({
        pastryId: id,
        name: p.name,
        flavor: flavorSel.value,
        qty: qty,
        lineTotal: lineTotal,
      });
    });

    return { items: items, total: total };
  }

  function updateSummary() {
    var collected = collectOrderLines();
    var items = collected.items;
    var total = collected.total;

    summaryList.innerHTML = "";
    if (items.length === 0) {
      summaryEmpty.hidden = false;
      summaryTotalWrap.hidden = true;
      summaryTotalEl.textContent = formatMoney(0);
      return;
    }

    summaryEmpty.hidden = true;
    summaryTotalWrap.hidden = false;

    items.forEach(function (item) {
      var li = document.createElement("li");
      li.className = "order-summary-item";
      li.innerHTML =
        "<span class=\"order-summary-item-main\">" +
        escapeHtml(item.name) +
        " · " +
        escapeHtml(item.flavor) +
        "</span>" +
        "<span class=\"order-summary-item-meta\">× " +
        item.qty +
        " · " +
        formatMoney(item.lineTotal) +
        "</span>";
      summaryList.appendChild(li);
    });

    summaryTotalEl.textContent = formatMoney(total);
  }

  function escapeHtml(s) {
    var div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  function saveOrderToStorage(order) {
    try {
      var raw = localStorage.getItem(ORDERS_STORAGE_KEY);
      var list = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(list)) list = [];
      list.unshift(order);
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
      /* ignore quota / private mode */
    }
  }

  function buildOrderEmailBody(orderRecord, lines, notes) {
    var when = new Date(orderRecord.createdAt).toLocaleString();
    var body = [];
    body.push("New order from Connie's Cake Shop website");
    body.push("");
    body.push("Order ID: " + orderRecord.id);
    body.push("Time: " + when);
    body.push("");
    body.push("Items:");
    lines.forEach(function (line) {
      body.push("• " + line);
    });
    body.push("");
    body.push("Total: " + formatMoney(orderRecord.total));
    if (notes) {
      body.push("");
      body.push("Customer notes: " + notes);
    }
    return body.join("\n");
  }

  function sendOrderEmail(orderRecord, lines, notes) {
    var OWNER_EMAIL = "dalisochanda@gmail.com";
    var payload = {
      _subject: "New Connie's Cake Shop order — " + orderRecord.id,
      _template: "table",
      _captcha: false,
      order_id: orderRecord.id,
      placed_at: new Date(orderRecord.createdAt).toLocaleString(),
      items: lines.join(" | "),
      total: formatMoney(orderRecord.total),
      notes: notes || "None",
      message: buildOrderEmailBody(orderRecord, lines, notes),
    };

    if (window.location.protocol === "file:") {
      return Promise.reject(
        new Error(
          "Open the site with the local server (http://localhost), not by double-clicking the HTML file. Email cannot send from file:// pages."
        )
      );
    }

    return fetch("https://formsubmit.co/ajax/" + OWNER_EMAIL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (result) {
        var data = result.data || {};
        var success =
          result.ok &&
          (data.success === true || data.success === "true" || data.message === "Form submitted successfully");

        if (success) return data;

        var msg = data.message || "Email request failed";
        if (/activation/i.test(msg) || /activate/i.test(msg)) {
          throw new Error(
            "Check dalisochanda@gmail.com (and Spam) for a FormSubmit 'Activate Form' email, click the link once, then place the order again."
          );
        }
        throw new Error(msg);
      });
  }

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.hidden = false;
    toastEl.classList.add("is-visible");
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(function () {
      toastEl.classList.remove("is-visible");
      toastEl.hidden = true;
    }, 5000);
  }

  addLine();

  if (addBtn) addBtn.addEventListener("click", addLine);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var collected = collectOrderLines();
    if (collected.items.length === 0) {
      showToast("Please choose at least one menu item first.");
      return;
    }
    var notesEl = form.querySelector("[name='notes']");
    var notes = notesEl && notesEl.value.trim() ? notesEl.value.trim() : "";

    var lines = collected.items.map(function (it) {
      return it.name + " (" + it.flavor + ") × " + it.qty + " — " + formatMoney(it.lineTotal);
    });

    var orderRecord = {
      id: "ord-" + Date.now(),
      createdAt: new Date().toISOString(),
      items: collected.items,
      total: collected.total,
      notes: notes,
    };
    saveOrderToStorage(orderRecord);

    var submitBtn = document.getElementById("submit-order");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }

    showToast("Placing order and emailing the shop…");

    sendOrderEmail(orderRecord, lines, notes)
      .then(function () {
        showToast("Order submitted — email sent to the shop.");
        window.alert(
          "Thanks! Your order was sent.\n\n• " +
            lines.join("\n• ") +
            (notes ? "\n\nNotes: " + notes : "") +
            "\n\nTotal: " +
            formatMoney(orderRecord.total)
        );
      })
      .catch(function (err) {
        var reason = (err && err.message) || "the email could not be sent";
        showToast("Order saved, but email failed.");
        window.alert(
          "Your order was saved for the shop board, but the notification email failed.\n\n" +
            reason +
            "\n\n• " +
            lines.join("\n• ") +
            (notes ? "\n\nNotes: " + notes : "") +
            "\n\nTotal: " +
            formatMoney(orderRecord.total)
        );
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Place order";
        }
      });
  });

  updateSummary();
})();
