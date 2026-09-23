/* Shelf - demo dataset.
   Every figure rendered anywhere in the template comes from this object.
   Replace the contents to point the dashboard at a real store. */
window.SHELF_DATA = (function () {

  var settings = {
    store: "Northbay Supply Co.",
    domain: "northbay.store",
    currency: "$",
    timezone: "UTC+00:00",
    user: { name: "Amara Ellis", email: "amara@northbay.store", initials: "AE", role: "Owner" }
  };

  function wave(n, base, amp, seed) {
    var out = [], s = seed || 11;
    for (var i = 0; i < n; i++) {
      s = (s * 9301 + 49297) % 233280;
      var noise = (s / 233280 - 0.5) * amp * 0.45;
      var weekly = Math.sin(i / 7 * Math.PI * 2) * amp * 0.26;
      var trend = (i / n) * amp * 0.55;
      out.push(Math.max(0, Math.round(base + weekly + trend + noise)));
    }
    return out;
  }
  function days(n) {
    var out = [], d = new Date(2026, 8, 19);
    for (var i = n - 1; i >= 0; i--)
      out.push(new Date(d.getTime() - i * 864e5)
        .toLocaleDateString("en-GB", { day: "2-digit", month: "short" }));
    return out;
  }
  var labels30 = days(30);

  var metrics = {
    revenue:   { label: "Revenue",        value: 184290, delta: 14.2, unit: "money", series: wave(30, 5400, 3000, 7) },
    orders:    { label: "Orders",         value: 3412,   delta: 9.8,  unit: "count", series: wave(30, 102, 46, 13) },
    aov:       { label: "Avg order value",value: 54.01,  delta: 4.1,  unit: "money", series: wave(30, 5200, 700, 19).map(function (v) { return v / 100; }) },
    refunds:   { label: "Refund rate",    value: 2.8,    delta: -0.6, unit: "pp", invert: true, series: wave(30, 30, 9, 23).map(function (v) { return v / 10; }) },
    sessions:  { label: "Sessions",       value: 128640, delta: 11.4, unit: "count", series: wave(30, 3800, 1600, 29) },
    cvr:       { label: "Conversion rate",value: 2.65,   delta: 0.18, unit: "pp",    series: wave(30, 260, 60, 31).map(function (v) { return v / 100; }) },
    customers: { label: "Customers",      value: 9840,   delta: 7.2,  unit: "count", series: wave(30, 290, 120, 37) },
    repeat:    { label: "Repeat rate",    value: 31.4,   delta: 2.1,  unit: "rate",  series: wave(30, 310, 40, 41).map(function (v) { return v / 10; }) },
    units:     { label: "Units sold",     value: 6128,   delta: 12.6, unit: "count", series: wave(30, 186, 74, 43) },
    fulfilled: { label: "Fulfilled today",value: 148,    delta: 6.4,  unit: "count" },
    pending:   { label: "Awaiting fulfilment", value: 62, delta: -8.2, unit: "count", invert: true },
    payout:    { label: "Next payout",    value: 42180,  delta: 9.1,  unit: "money" }
  };

  var channels = [
    { name: "Online store", revenue: 106890, orders: 1982, share: 58.0, aov: 53.93, delta: 12.4 },
    { name: "Marketplace",  revenue: 40540,  orders: 742,  share: 22.0, aov: 54.64, delta: 21.8 },
    { name: "Social shop",  revenue: 20270,  orders: 402,  share: 11.0, aov: 50.42, delta: 34.2 },
    { name: "Retail POS",   revenue: 16590,  orders: 286,  share: 9.0,  aov: 58.01, delta: -4.6 }
  ];

  var products = [
    { sku: "AW-204", name: "Aster Wool Runner",   cat: "Footwear",   units: 812,  revenue: 38964, stock: 46,  price: 48, state: "In stock",    tone: "ok" },
    { sku: "ND-140", name: "Nomad Duffel 40L",    cat: "Bags",       units: 604,  revenue: 33220, stock: 12,  price: 55, state: "Low stock",   tone: "warn" },
    { sku: "HR-330", name: "Harbor Rain Shell",   cat: "Outerwear",  units: 316,  revenue: 28440, stock: 64,  price: 90, state: "In stock",    tone: "ok" },
    { sku: "CL-088", name: "Cove Linen Shirt",    cat: "Tops",       units: 588,  revenue: 26460, stock: 118, price: 45, state: "In stock",    tone: "ok" },
    { sku: "PT-011", name: "Pike Trail Cap",      cat: "Accessories",units: 742,  revenue: 14840, stock: 0,   price: 20, state: "Out of stock",tone: "bad" },
    { sku: "FM-007", name: "Fen Merino Socks",    cat: "Accessories",units: 1204, revenue: 12040, stock: 320, price: 10, state: "In stock",    tone: "ok" },
    { sku: "GB-512", name: "Glen Canvas Belt",    cat: "Accessories",units: 486,  revenue: 9720,  stock: 88,  price: 20, state: "In stock",    tone: "ok" },
    { sku: "SB-220", name: "Slate Bucket Hat",    cat: "Accessories",units: 352,  revenue: 8800,  stock: 9,   price: 25, state: "Low stock",   tone: "warn" },
    { sku: "TW-410", name: "Thorn Work Jacket",   cat: "Outerwear",  units: 164,  revenue: 19680, stock: 37,  price: 120,state: "In stock",    tone: "ok" },
    { sku: "MC-095", name: "Marsh Cotton Tee",    cat: "Tops",       units: 906,  revenue: 18120, stock: 240, price: 20, state: "In stock",    tone: "ok" },
    { sku: "RB-330", name: "Ridge Boot",          cat: "Footwear",   units: 142,  revenue: 21300, stock: 0,   price: 150,state: "Out of stock",tone: "bad" },
    { sku: "LN-060", name: "Loam Notebook",       cat: "Home",       units: 640,  revenue: 7680,  stock: 410, price: 12, state: "In stock",    tone: "ok" }
  ];

  var orders = [
    { id: "#10482", customer: "Marta Kovacs",  initials: "MK", when: "19 Sep 09:41", items: 2, total: 128.40, status: "Paid",       tone: "ok",   channel: "Online store", country: "Hungary" },
    { id: "#10481", customer: "Dane Whitlock", initials: "DW", when: "19 Sep 09:12", items: 1, total: 54.00,  status: "Fulfilled",  tone: "ok",   channel: "Marketplace",  country: "United Kingdom" },
    { id: "#10480", customer: "Priya Raman",   initials: "PR", when: "19 Sep 08:54", items: 5, total: 312.90, status: "Pending",    tone: "warn", channel: "Online store", country: "India" },
    { id: "#10479", customer: "Tomas Berg",    initials: "TB", when: "19 Sep 08:31", items: 1, total: 79.00,  status: "Refunded",   tone: "bad",  channel: "Social shop",  country: "Sweden" },
    { id: "#10478", customer: "Lena Fischer",  initials: "LF", when: "19 Sep 08:02", items: 3, total: 186.20, status: "Paid",       tone: "ok",   channel: "Online store", country: "Germany" },
    { id: "#10477", customer: "Owen Bright",   initials: "OB", when: "19 Sep 07:48", items: 2, total: 98.00,  status: "Fulfilled",  tone: "ok",   channel: "Retail POS",   country: "Ireland" },
    { id: "#10476", customer: "Sara Lindholm", initials: "SL", when: "19 Sep 07:21", items: 4, total: 244.60, status: "Paid",       tone: "ok",   channel: "Online store", country: "Finland" },
    { id: "#10475", customer: "Jae Park",      initials: "JP", when: "19 Sep 06:58", items: 1, total: 120.00, status: "Cancelled",  tone: "bad",  channel: "Marketplace",  country: "South Korea" },
    { id: "#10474", customer: "Nina Duarte",   initials: "ND", when: "18 Sep 22:14", items: 6, total: 398.80, status: "Fulfilled",  tone: "ok",   channel: "Online store", country: "Portugal" },
    { id: "#10473", customer: "Felix Moreau",  initials: "FM", when: "18 Sep 21:02", items: 2, total: 110.00, status: "Pending",    tone: "warn", channel: "Social shop",  country: "France" },
    { id: "#10472", customer: "Hana Suzuki",   initials: "HS", when: "18 Sep 19:44", items: 3, total: 165.00, status: "Paid",       tone: "ok",   channel: "Online store", country: "Japan" },
    { id: "#10471", customer: "Ciaran Doyle",  initials: "CD", when: "18 Sep 18:20", items: 1, total: 48.00,  status: "Fulfilled",  tone: "ok",   channel: "Retail POS",   country: "Ireland" }
  ];

  var orderStatus = [
    { name: "Paid",       count: 2118, share: 62.0 },
    { name: "Fulfilled",  count: 716,  share: 21.0 },
    { name: "Pending",    count: 308,  share: 9.0 },
    { name: "Refunded",   count: 168,  share: 5.0 },
    { name: "Cancelled",  count: 102,  share: 3.0 }
  ];

  var customers = [
    { name: "Nina Duarte",   initials: "ND", email: "nina@example.com",   orders: 14, spend: 1862.40, last: "18 Sep", group: "VIP",      country: "Portugal" },
    { name: "Lena Fischer",  initials: "LF", email: "lena@example.com",   orders: 11, spend: 1420.80, last: "19 Sep", group: "VIP",      country: "Germany" },
    { name: "Marta Kovacs",  initials: "MK", email: "marta@example.com",  orders: 8,  spend: 944.20,  last: "19 Sep", group: "Returning",country: "Hungary" },
    { name: "Owen Bright",   initials: "OB", email: "owen@example.com",   orders: 6,  spend: 712.00,  last: "19 Sep", group: "Returning",country: "Ireland" },
    { name: "Hana Suzuki",   initials: "HS", email: "hana@example.com",   orders: 5,  spend: 640.00,  last: "18 Sep", group: "Returning",country: "Japan" },
    { name: "Priya Raman",   initials: "PR", email: "priya@example.com",  orders: 3,  spend: 486.90,  last: "19 Sep", group: "Returning",country: "India" },
    { name: "Dane Whitlock", initials: "DW", email: "dane@example.com",   orders: 2,  spend: 162.00,  last: "19 Sep", group: "New",      country: "United Kingdom" },
    { name: "Jae Park",      initials: "JP", email: "jae@example.com",    orders: 1,  spend: 120.00,  last: "19 Sep", group: "New",      country: "South Korea" }
  ];

  var discounts = [
    { code: "AUTUMN20",   type: "20% off",     used: 842, limit: 2000, revenue: 38420, ends: "30 Sep", status: "Active",    tone: "ok" },
    { code: "FREESHIP60", type: "Free shipping", used: 1264, limit: null, revenue: 62180, ends: "No end", status: "Active", tone: "ok" },
    { code: "WELCOME10",  type: "10% off",     used: 486, limit: 1000, revenue: 14260, ends: "No end", status: "Active",    tone: "ok" },
    { code: "SUMMER25",   type: "25% off",     used: 1980, limit: 2000, revenue: 71240, ends: "31 Aug", status: "Expired",  tone: "bad" },
    { code: "VIP15",      type: "15% off",     used: 118, limit: 500,  revenue: 9840,  ends: "31 Dec", status: "Scheduled", tone: "warn" }
  ];

  var abandoned = [
    { id: "AC-4821", customer: "Elif Yilmaz",  initials: "EY", value: 148.00, items: 3, when: "42 min ago", stage: "Payment",  tone: "warn" },
    { id: "AC-4820", customer: "Ruben Sosa",   initials: "RS", value: 92.00,  items: 2, when: "1 h ago",    stage: "Shipping", tone: "warn" },
    { id: "AC-4819", customer: "Amelia Stone", initials: "AS", value: 310.00, items: 5, when: "2 h ago",    stage: "Contact",  tone: "bad" },
    { id: "AC-4818", customer: "Kwame Asare",  initials: "KA", value: 65.00,  items: 1, when: "3 h ago",    stage: "Payment",  tone: "warn" },
    { id: "AC-4817", customer: "Ines Barros",  initials: "IB", value: 204.00, items: 4, when: "5 h ago",    stage: "Shipping", tone: "warn" }
  ];

  var returns = [
    { id: "RT-2214", order: "#10412", customer: "Jae Park",     reason: "Wrong size",     value: 120.00, status: "Approved", tone: "ok",   when: "18 Sep" },
    { id: "RT-2213", order: "#10388", customer: "Tomas Berg",   reason: "Changed mind",   value: 79.00,  status: "Refunded", tone: "ok",   when: "17 Sep" },
    { id: "RT-2212", order: "#10344", customer: "Ruben Sosa",   reason: "Damaged in transit", value: 90.00, status: "Review", tone: "warn", when: "16 Sep" },
    { id: "RT-2211", order: "#10301", customer: "Elif Yilmaz",  reason: "Not as described", value: 48.00, status: "Declined", tone: "bad", when: "15 Sep" },
    { id: "RT-2210", order: "#10288", customer: "Amelia Stone", reason: "Wrong size",     value: 150.00, status: "Refunded", tone: "ok",   when: "14 Sep" }
  ];

  var returnReasons = [
    { name: "Wrong size", count: 84 }, { name: "Changed mind", count: 61 },
    { name: "Damaged in transit", count: 34 }, { name: "Not as described", count: 22 },
    { name: "Late delivery", count: 14 }
  ];

  var inventory = products.map(function (p) {
    return { sku: p.sku, name: p.name, cat: p.cat, stock: p.stock, incoming: p.stock < 20 ? 200 : 0,
             committed: Math.round(p.units / 40), days: p.stock === 0 ? 0 : Math.round(p.stock / (p.units / 30)),
             state: p.state, tone: p.tone };
  });

  var purchaseOrders = [
    { id: "PO-1180", supplier: "Kestrel Mills",   items: 4, units: 900,  cost: 18400, eta: "24 Sep", status: "In transit", tone: "warn" },
    { id: "PO-1179", supplier: "Varden Textiles", items: 2, units: 400,  cost: 9200,  eta: "29 Sep", status: "Confirmed",  tone: "ok" },
    { id: "PO-1178", supplier: "Orla Leatherwork",items: 3, units: 250,  cost: 14600, eta: "02 Oct", status: "Draft",      tone: "info" },
    { id: "PO-1177", supplier: "Kestrel Mills",   items: 6, units: 1400, cost: 26800, eta: "12 Sep", status: "Received",   tone: "ok" }
  ];

  var fulfilment = [
    { id: "#10480", customer: "Priya Raman",  items: 5, method: "Express",  warehouse: "Bristol", age: "3 h",  tone: "warn", status: "Awaiting pick" },
    { id: "#10473", customer: "Felix Moreau", items: 2, method: "Standard", warehouse: "Bristol", age: "14 h", tone: "warn", status: "Awaiting pick" },
    { id: "#10470", customer: "Ines Barros",  items: 4, method: "Standard", warehouse: "Porto",   age: "1 d",  tone: "bad",  status: "Packed" },
    { id: "#10468", customer: "Kwame Asare",  items: 1, method: "Express",  warehouse: "Bristol", age: "1 d",  tone: "ok",   status: "Label printed" },
    { id: "#10465", customer: "Amelia Stone", items: 3, method: "Standard", warehouse: "Porto",   age: "2 d",  tone: "ok",   status: "Handed to carrier" }
  ];

  var payouts = [
    { id: "PO-90218", when: "22 Sep", gross: 46820, fees: 1364, refunds: 3276, net: 42180, status: "Scheduled", tone: "warn" },
    { id: "PO-90217", when: "15 Sep", gross: 51240, fees: 1492, refunds: 2180, net: 47568, status: "Paid",      tone: "ok" },
    { id: "PO-90216", when: "08 Sep", gross: 44160, fees: 1286, refunds: 1940, net: 40934, status: "Paid",      tone: "ok" },
    { id: "PO-90215", when: "01 Sep", gross: 39840, fees: 1160, refunds: 2460, net: 36220, status: "Paid",      tone: "ok" }
  ];

  var transactions = [
    { id: "TX-77421", order: "#10482", method: "Card",       gross: 128.40, fee: 4.02, net: 124.38, status: "Captured", tone: "ok",   when: "19 Sep 09:41" },
    { id: "TX-77420", order: "#10481", method: "Wallet",     gross: 54.00,  fee: 1.86, net: 52.14,  status: "Captured", tone: "ok",   when: "19 Sep 09:12" },
    { id: "TX-77419", order: "#10480", method: "Card",       gross: 312.90, fee: 9.37, net: 303.53, status: "Pending",  tone: "warn", when: "19 Sep 08:54" },
    { id: "TX-77418", order: "#10479", method: "Card",       gross: -79.00, fee: 0,    net: -79.00, status: "Refunded", tone: "bad",  when: "19 Sep 08:31" },
    { id: "TX-77417", order: "#10478", method: "Bank",       gross: 186.20, fee: 2.10, net: 184.10, status: "Captured", tone: "ok",   when: "19 Sep 08:02" },
    { id: "TX-77416", order: "#10477", method: "Card",       gross: 98.00,  fee: 3.14, net: 94.86,  status: "Captured", tone: "ok",   when: "19 Sep 07:48" }
  ];

  var collections = [
    { name: "Autumn essentials", products: 24, revenue: 62840, state: "Published", tone: "ok" },
    { name: "Trail and travel",  products: 18, revenue: 48120, state: "Published", tone: "ok" },
    { name: "Everyday basics",   products: 32, revenue: 39460, state: "Published", tone: "ok" },
    { name: "Winter preview",    products: 12, revenue: 0,     state: "Draft",     tone: "info" },
    { name: "Last chance",       products: 9,  revenue: 14280, state: "Scheduled", tone: "warn" }
  ];

  var reviews = [
    { product: "Aster Wool Runner", customer: "Nina Duarte",  stars: 5, body: "Second pair. They hold up in wet weather better than anything else I own.", when: "18 Sep", state: "Published" },
    { product: "Nomad Duffel 40L",  customer: "Owen Bright",  stars: 4, body: "Excellent bag. The shoulder strap padding could be thicker for long carries.", when: "17 Sep", state: "Published" },
    { product: "Pike Trail Cap",    customer: "Dane Whitlock",stars: 2, body: "Sizing runs small. Ordered large and it sits high on the head.", when: "17 Sep", state: "Pending" },
    { product: "Harbor Rain Shell", customer: "Lena Fischer", stars: 5, body: "Kept me dry through a week of rain. Packs down small.", when: "16 Sep", state: "Published" },
    { product: "Cove Linen Shirt",  customer: "Hana Suzuki",  stars: 3, body: "Lovely fabric but it creases the moment you sit down.", when: "15 Sep", state: "Published" }
  ];

  var segments = [
    { name: "VIP customers",     rule: "lifetime spend over 1,000", people: 284,  share: 2.9,  used: "today" },
    { name: "Repeat buyers",     rule: "2 or more orders",          people: 3090, share: 31.4, used: "2 days ago" },
    { name: "Lapsed 90 days",    rule: "no order in 90 days",       people: 1842, share: 18.7, used: "yesterday" },
    { name: "Discount led",      rule: "every order used a code",   people: 964,  share: 9.8,  used: "1 week ago" },
    { name: "High return rate",  rule: "returned 2 or more orders", people: 218,  share: 2.2,  used: "3 days ago" }
  ];

  var campaigns = [
    { name: "Autumn launch", channel: "Email",   sent: 24800, opened: 41.2, clicked: 6.8, revenue: 28640, state: "Sent",      tone: "ok" },
    { name: "Back in stock", channel: "Email",   sent: 8420,  opened: 58.4, clicked: 14.2, revenue: 19240, state: "Sent",     tone: "ok" },
    { name: "Cart recovery", channel: "Email",   sent: 3180,  opened: 46.8, clicked: 11.6, revenue: 12480, state: "Running",  tone: "warn" },
    { name: "Winter preview",channel: "SMS",     sent: 0,     opened: 0,    clicked: 0,   revenue: 0,     state: "Draft",     tone: "info" },
    { name: "VIP early access", channel: "Email",sent: 284,   opened: 72.1, clicked: 28.4, revenue: 16820, state: "Sent",     tone: "ok" }
  ];

  var cohorts = {
    columns: ["Month 0", "Month 1", "Month 2", "Month 3", "Month 4", "Month 5"],
    rows: [
      { label: "Apr", size: 1240, values: [100, 38, 26, 21, 18, 16] },
      { label: "May", size: 1420, values: [100, 41, 29, 23, 20, null] },
      { label: "Jun", size: 1680, values: [100, 44, 32, 26, null, null] },
      { label: "Jul", size: 1810, values: [100, 46, 34, null, null, null] },
      { label: "Aug", size: 2040, values: [100, 49, null, null, null, null] },
      { label: "Sep", size: 2260, values: [100, null, null, null, null, null] }
    ]
  };

  var funnel = [
    { label: "Sessions",          value: 128640, pct: 100,  drop: 0 },
    { label: "Product viewed",    value: 61740,  pct: 48.0, drop: 52.0 },
    { label: "Added to cart",     value: 18420,  pct: 14.3, drop: 70.2 },
    { label: "Checkout started",  value: 6840,   pct: 5.3,  drop: 62.9 },
    { label: "Order placed",      value: 3412,   pct: 2.65, drop: 50.1 }
  ];

  var shipping = [
    { zone: "United Kingdom", rate: "Free over 60", price: 4.95, orders: 1284, days: "1 to 2" },
    { zone: "European Union", rate: "Flat rate",    price: 7.50, orders: 1108, days: "3 to 5" },
    { zone: "North America",  rate: "Flat rate",    price: 12.00, orders: 642, days: "5 to 8" },
    { zone: "Rest of world",  rate: "Calculated",   price: 0,     orders: 378, days: "7 to 14" }
  ];

  var apps = [
    { name: "Payments",        state: "Connected",     detail: "Cards, wallets and bank transfer" },
    { name: "Accounting sync", state: "Connected",     detail: "Nightly at 02:00" },
    { name: "Email marketing", state: "Connected",     detail: "Campaigns and flows" },
    { name: "Review requests", state: "Connected",     detail: "Sent 7 days after delivery" },
    { name: "Ad platform",     state: "Not connected", detail: "Needed for spend and return on ad spend" },
    { name: "Warehouse",       state: "Not connected", detail: "Third party fulfilment sync" }
  ];

  var staff = [
    { initials: "AE", name: "Amara Ellis",   role: "Owner",      last: "now",        two: "On" },
    { initials: "JL", name: "Jonas Lund",    role: "Manager",    last: "12 min ago", two: "On" },
    { initials: "PM", name: "Priya Mehta",   role: "Fulfilment", last: "1 h ago",    two: "On" },
    { initials: "DK", name: "Dan Kovac",     role: "Support",    last: "yesterday",  two: "Off" },
    { initials: "SO", name: "Sofia Okafor",  role: "Marketing",  last: "2 days ago", two: "On" }
  ];

  var roles = [
    { cap: "View orders",        Owner: 1, Manager: 1, Fulfilment: 1, Support: 1, Marketing: 0 },
    { cap: "Refund an order",    Owner: 1, Manager: 1, Fulfilment: 0, Support: 1, Marketing: 0 },
    { cap: "Edit products",      Owner: 1, Manager: 1, Fulfilment: 0, Support: 0, Marketing: 0 },
    { cap: "Manage discounts",   Owner: 1, Manager: 1, Fulfilment: 0, Support: 0, Marketing: 1 },
    { cap: "View payouts",       Owner: 1, Manager: 1, Fulfilment: 0, Support: 0, Marketing: 0 },
    { cap: "Invite staff",       Owner: 1, Manager: 0, Fulfilment: 0, Support: 0, Marketing: 0 },
    { cap: "Close the store",    Owner: 1, Manager: 0, Fulfilment: 0, Support: 0, Marketing: 0 }
  ];

  var giftCards = [
    { code: "GC-4821-0092", value: 100, left: 42.50, issued: "02 Sep", to: "nina@example.com",  status: "Active",   tone: "ok" },
    { code: "GC-4820-7741", value: 50,  left: 50.00, issued: "11 Sep", to: "owen@example.com",  status: "Active",   tone: "ok" },
    { code: "GC-4819-2210", value: 25,  left: 0,     issued: "20 Aug", to: "lena@example.com",  status: "Used",     tone: "info" },
    { code: "GC-4818-5530", value: 200, left: 200.00,issued: "18 Sep", to: "marta@example.com", status: "Active",   tone: "ok" },
    { code: "GC-4817-1184", value: 75,  left: 12.00, issued: "04 Jul", to: "jae@example.com",   status: "Expiring", tone: "warn" }
  ];

  var countries = [
    { name: "United Kingdom", revenue: 54280, orders: 1042 },
    { name: "Germany",        revenue: 31640, orders: 598 },
    { name: "France",         revenue: 22180, orders: 412 },
    { name: "United States",  revenue: 20940, orders: 344 },
    { name: "Ireland",        revenue: 14620, orders: 286 },
    { name: "Portugal",       revenue: 11840, orders: 224 },
    { name: "Sweden",         revenue: 9260,  orders: 178 },
    { name: "Japan",          revenue: 8140,  orders: 142 }
  ];

  var liveFeed = [
    { what: "Order #10482 placed", who: "Hungary",        amt: "$128.40" },
    { what: "Added to cart",       who: "United Kingdom", amt: "Aster Wool Runner" },
    { what: "Order #10481 paid",   who: "United Kingdom", amt: "$54.00" },
    { what: "Checkout started",    who: "Germany",        amt: "$186.20" },
    { what: "Product viewed",      who: "India",          amt: "Nomad Duffel 40L" },
    { what: "Order #10478 placed", who: "Germany",        amt: "$186.20" },
    { what: "Added to cart",       who: "Portugal",       amt: "Harbor Rain Shell" },
    { what: "Review submitted",    who: "Ireland",        amt: "5 stars" }
  ];

  var notifications = [
    { title: "Pike Trail Cap is out of stock", body: "18 open orders are waiting on this item", when: "20 min ago", unread: true },
    { title: "Payout scheduled",   body: "$42,180 arrives 22 September",                        when: "2 h ago",    unread: true },
    { title: "Return needs review", body: "RT-2212, damaged in transit, $90.00",                when: "yesterday",  unread: true },
    { title: "Autumn launch sent",  body: "24,800 recipients, 41.2% opened",                    when: "3 days ago", unread: false }
  ];

  var definitions = {
    revenue: "Gross sales minus discounts and returns, before shipping and tax.",
    orders: "Paid orders placed in the period. Cancelled orders are excluded.",
    aov: "Revenue divided by the number of orders in the same period.",
    refunds: "Refunded value as a share of revenue. Lower is better.",
    sessions: "Visits to the storefront. A session ends after 30 minutes of inactivity.",
    cvr: "Orders divided by sessions for the same period.",
    customers: "People with at least one paid order, counted once.",
    repeat: "Share of customers in the period who have ordered before.",
    units: "Individual items sold across all orders.",
    payout: "Net amount due on the next scheduled payout date."
  };

  return {
    settings: settings, labels30: labels30, metrics: metrics, definitions: definitions,
    channels: channels, products: products, orders: orders, orderStatus: orderStatus,
    customers: customers, discounts: discounts, abandoned: abandoned, returns: returns,
    returnReasons: returnReasons, inventory: inventory, purchaseOrders: purchaseOrders,
    fulfilment: fulfilment, payouts: payouts, transactions: transactions, collections: collections,
    reviews: reviews, segments: segments, campaigns: campaigns, cohorts: cohorts, funnel: funnel,
    shipping: shipping, apps: apps, staff: staff, roles: roles, giftCards: giftCards,
    countries: countries, liveFeed: liveFeed, notifications: notifications
  };
})();
