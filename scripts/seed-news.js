const Database = require('better-sqlite3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const db = new Database(path.join(process.cwd(), 'data', 'gallop.db'));

// Clear existing news
db.prepare('DELETE FROM news').run();
console.log('Cleared existing news');

const articles = [
  {
    title: 'Selcom Elevator Door Parts Shipment to Saudi Arabia and Jordan',
    slug: 'shipment-selcom-elevator-door-parts-saudi-arabia-jordan',
    content: `<p>We recently completed a shipment of Selcom elevator door spare parts for customers in Saudi Arabia and Jordan. These components are commonly used for elevator maintenance, modernization projects, and replacement of worn door system parts in residential and commercial buildings.</p>
<p>Both markets continue to show strong demand for reliable elevator spare parts, particularly for door operator systems where components experience frequent mechanical movement and daily operational cycles.</p>
<h2>Products Included in This Shipment</h2>
<p>This order includes several commonly used Selcom door system components:</p>
<ul>
<li><a href="/product/eco-door-control-board">Selcom ECO Door Control Board 903510G01S-L</a></li>
<li><a href="/product/eco-motor">Selcom ECO Door Motor</a></li>
<li><a href="/product/eco-door-cam">Selcom ECO Door Cam</a></li>
<li><a href="/product/landing-look-set">Selcom Landing Door Lock Set</a></li>
<li><a href="/product/door-rope-roller">Selcom Door Rope Roller 64mm</a></li>
<li><a href="/product/driving-cable">Selcom Door Motor Steel Rope</a></li>
</ul>
<p>These components are widely used in Selcom door operator systems installed in residential towers, hotels, shopping centers, and office buildings across the Middle East.</p>
<p>For elevator maintenance companies, keeping spare units of door motors, cams, rollers and landing door locks is essential to ensure quick repair and reduce downtime when faults occur.</p>
<h2>Quality Inspection and Packing</h2>
<p>Before shipment, each component is carefully inspected to ensure compatibility with Selcom door systems. Electronic components such as the Selcom ECO Door Control Board 903510G01S-L are tested for proper signal response and electrical stability.</p>
<p>Mechanical components including door cams, rollers and landing door lock assemblies are checked for structural integrity and correct alignment to ensure smooth installation during elevator maintenance.</p>
<p>All parts are packed securely to prevent damage during international transportation to Saudi Arabia and Jordan.</p>
<h2>Elevator Maintenance Demand in Saudi Arabia and Jordan</h2>
<p>Saudi Arabia remains one of the largest elevator markets in the Middle East due to the rapid development of residential buildings, hotels and commercial complexes. Elevator door systems require regular maintenance because door operators experience the highest movement frequency within the elevator system.</p>
<p>Jordan also has a stable demand for spare parts as many elevators installed in residential buildings require periodic maintenance and replacement of door system components.</p>
<p>Providing reliable spare parts supply allows maintenance companies to complete repairs quickly and keep elevators operating safely.</p>
<h2>Conclusion</h2>
<p>This shipment to Saudi Arabia and Jordan reflects the continuous demand for reliable elevator spare parts in the Middle East. By maintaining stable supply of key Selcom door system components, elevator maintenance companies can ensure safe and smooth door operation across a wide range of building installations.</p>`,
    excerpt: 'We recently completed a shipment of Selcom elevator door spare parts for customers in Saudi Arabia and Jordan, including ECO Door Control Boards, Door Motors, Door Cams, and Landing Door Lock Sets.',
    image: 'https://www.gallopliftparts.com/wp-content/uploads/2024/04/selcom-door.jpg',
    category: 'Shipping',
    created_at: '2026-03-10 00:00:00',
    sort_order: 0,
  },
  {
    title: 'Selcom Door',
    slug: 'selcom-door',
    content: `<h3>Landing Door:</h3>
<ul>
<li>Width: 700, 800, 900, 1000, 1200</li>
<li>Opening way: Center, Side</li>
<li>Panel's material: Painted, Stainless steel</li>
</ul>
<h3>Car Door:</h3>
<ul>
<li>Type: ECO, VVVF</li>
<li>Width: 700, 800, 900, 1000, 1200</li>
<li>Opening way: Center, Side</li>
<li>Panel's material: Painted, Stainless steel</li>
</ul>
<p>Elevator door is a very important component in the elevator, and it is also what passengers can see, especially the appearance. The quality can be directly reflected in the eyes of passengers.</p>
<p>The surface can also be made into painted, stainless steel, etching, mirror and other styles.</p>
<p>There are many types of it, including European-style and Japanese-style. European-style are complicated to install, but they are very safe, while Japanese-style are simple to install and low in price. European-style are popular in Europe and the Middle East, while Japanese-style are popular in China and Southeast Asia.</p>
<p>We can produce various types, the factory is located in Jiangsu, China.</p>
<p>If you don't know how to choose a model, our professional team will give you technical guidance. If you have after-sales problems, we will help you solve them as soon as possible, through chat tools, or voice or video calls.</p>
<div class="gallery">
<figure class="gallery-item"><div class="gallery-icon"><img src="https://www.gallopliftparts.com/wp-content/uploads/2024/04/selcom-landing-door-right.jpg" alt="Landing door side"></div><figcaption>Landing door side</figcaption></figure>
<figure class="gallery-item"><div class="gallery-icon"><img src="https://www.gallopliftparts.com/wp-content/uploads/2024/04/selcom-langing-door-center.png" alt="Landing door center"></div><figcaption>Landing door center</figcaption></figure>
<figure class="gallery-item"><div class="gallery-icon"><img src="https://www.gallopliftparts.com/wp-content/uploads/2024/05/selcom_landing-_door_left.png" alt="Landing door left"></div><figcaption>Landing door left</figcaption></figure>
<figure class="gallery-item"><div class="gallery-icon"><img src="https://www.gallopliftparts.com/wp-content/uploads/2024/05/Selcom-Car-Door-Right.jpg" alt="Car door side"></div><figcaption>Car door side</figcaption></figure>
</div>`,
    excerpt: 'Selcom elevator doors - Landing doors and Car doors available in widths 700-1200mm, center and side opening, painted or stainless steel panels.',
    image: 'https://www.gallopliftparts.com/wp-content/uploads/2024/04/selcom-door.jpg',
    category: 'Shipping',
    created_at: '2024-05-29 00:00:00',
    sort_order: 1,
  },
  {
    title: 'MONTEFERRO Guide Rail',
    slug: 'monteferro-guide-rail',
    content: `<p>Monteferro is an Italian brand that specializes in elevator accessories and produces elevator guide rails. It has a manufacturing plant in China.</p>
<p>Its brand is very popular in China, the Middle East and Europe.</p>
<p>The main models are T45/A T50/A T50/B T89/B T90/B</p>
<p>Our goods are provided directly from the factory, and the prices are very advantageous.</p>
<div class="gallery">
<figure class="gallery-item"><div class="gallery-icon"><img src="https://www.gallopliftparts.com/wp-content/uploads/2024/05/guide-rail-2.jpg" alt="Monteferro Guide Rail"></div><figcaption>Monteferro Guide Rail</figcaption></figure>
</div>`,
    excerpt: 'Monteferro is an Italian brand specializing in elevator guide rails with models T45/A, T50/A, T50/B, T89/B, T90/B. Factory direct pricing.',
    image: 'https://www.gallopliftparts.com/wp-content/uploads/2024/05/guide-rail-2.jpg',
    category: 'Shipping',
    created_at: '2024-05-16 00:00:00',
    sort_order: 2,
  },
  {
    title: 'Your Elevator & Escalator Parts Shipping',
    slug: 'your-elevator-escalator-parts-shipping',
    content: `<p>As a professional one-stop elevator solutions provider, we always strive to provide with excellence and offer best value for our esteemed customers. Our policy is to offer our customers direct and complete support, in terms of materials, components and services provided before and after every sale.</p>
<h2>How we send out your products after packing gets ready?</h2>
<p>For products like controllers, traction machines, cabins, guide rails or elevator doors etc. that come out a heavy weight more than 200kg or so, international sea shipping will be a first choice for its cost efficiency and safety. Delivery time vary from 7-30 days depending on the distance of the destination port.</p>
<p>For small order weighing around 100kg or under, we offer excellent international express shipping service such as DHL, FEDEX, UPS, ARAMAX, etc. To ensure you receive products in a prompt time normally in 3-7 days.</p>`,
    excerpt: 'Learn how we ship elevator and escalator parts worldwide - sea shipping for heavy orders (200kg+) and express shipping (DHL, FedEx, UPS) for smaller orders.',
    image: 'https://www.gallopliftparts.com/wp-content/uploads/2024/04/packing-1.jpg',
    category: 'Shipping',
    created_at: '2021-09-05 00:00:00',
    sort_order: 3,
  },
  {
    title: 'Elevator Output Continues to Grow Steadily',
    slug: 'elevator-output-continues-to-grow-steadily',
    content: `<p>With the improvement of China's economic level, the progress of urbanization, and the improvement of people's quality of life, China's elevator industry has achieved rapid development. According to the data, elevator output increased from 168,000 units in 2006 to 760,000 units in 2015, with a CAGR of approximately 19.53%. In 2015, China's elevator production increased by 6% year-on-year, and the number of elevators exceeded 4.26 million units. The annual output and quantity of elevators in China ranks first in the world.</p>
<p>Although the number of elevators in China has grown rapidly, due to the large population base in China, the average number of elevators per capita in China is only about 24 units per million people. Compared with European and American developed countries with higher rates of urbanization, less than half of Japan and one third of Germany still have a huge gap. In the long run, the ratio of elevators in China will still be in a stage of improvement in the future.</p>
<p>In the past ten years, China's elevator export volume has maintained a rapid growth. In 2015, elevator exports reached a new high, totaling 71,666 units. Compared with the domestic market, overseas markets have more space and growth.</p>
<p>Under the background of explosive growth in elevator sales and steady growth, the number of domestic elevators has increased year by year. What follows is a huge market opportunity for the elevator market, the maintenance and repair market.</p>
<p>The "Special Equipment Safety Law" stipulates that elevators should perform lubrication, adjustment and inspection of elevators at least once every 15 days in accordance with the requirements of the national safety technical specifications, and have stable and continuous maintenance requirements.</p>
<p>At present, China is still in the process of accelerating industrialization and urbanization. Investment in residential construction, commercial real estate, and infrastructure construction will remain at a relatively high level. The elevator industry is far from saturated, and the market prospects for elevator products are good.</p>`,
    excerpt: "China's elevator output grew from 168,000 units in 2006 to 760,000 units in 2015 with a CAGR of 19.53%. The maintenance and repair market continues to expand.",
    image: 'https://www.gallopliftparts.com/wp-content/uploads/2021/08/button.webp',
    category: 'Shipping',
    created_at: '2021-08-31 00:00:00',
    sort_order: 4,
  },
  {
    title: 'What Are the Main Elevator Parts?',
    slug: 'what-are-the-main-elevator-parts',
    content: `<p><strong>Machine room:</strong> speed limiter, motor, brake, wire duct, motor base, encoder, laissez-faire device, emergency electric or maintenance device, control cabinet (control loop, signal loop, safety loop, drive module, contactor relay, power supply, cooling device, etc.) socket, distribution box, intercom.</p>
<p><strong>Car:</strong> car frame, guardrail, car roof, car wall, bottom row, bottom beam, weighing (may also be installed at the rope head), control panel, display, maintenance device, signaling device, car door, door opening and closing device, emergency lights, lighting, alarm devices, safety windows (optional), safety gear, mechanical locks (optional), intercom.</p>
<p><strong>Shaft:</strong> guide rails, signaling devices, accompanying cables, compensation devices, hall doors, safety doors (optional), lighting.</p>
<p><strong>Pit:</strong> buffer and base, tensioning wheel, emergency stop, socket, intercom.</p>`,
    excerpt: 'A comprehensive overview of main elevator parts including machine room components, car parts, shaft elements, and pit equipment.',
    image: 'https://www.gallopliftparts.com/wp-content/uploads/2024/05/elevator-parts-2.webp',
    category: 'Shipping',
    created_at: '2021-08-19 00:00:00',
    sort_order: 5,
  },
  {
    title: 'Elevator Safety Parts - Light Curtain',
    slug: 'elevator-safety-parts-light-curtain',
    content: `<p>The elevator light curtain is made of a kind of principle of photoelectric sensor and elevator door safety device, applicable to all elevators, to ensure the safety of the passengers in and out of the elevator.</p>
<p>An elevator light curtain is installed in the elevator door on both sides of the Infrared transmitter and receiver and a special flexible cable is composed of three parts. Need for environmental protection and energy saving, more and more elevators have dispensed with power supply boxes.</p>
<p>Light curtain transmitter has several infrared transmitting tubes, under the control of MCU, launch receiving tube opening, one launch hair shoot the light is more receiving head, forming multiple scans. Continuous scanning through the top-down car door area, forming a dense infrared light curtain protection.</p>
<p>When any of the beams of light is blocked, unable to realize the photoelectric conversion, the screen is covered, so an interrupt signal output. Upon receiving the signal from the screen to the control system, immediately open the output signal, the car door stop off and reverse open, until the passenger or the obstacle after leaving the warning area elevator door can normally closed, so as to achieve security purposes, which can avoid the elevator clip person accident.</p>
<p>WECO-917A model door sensor was developed since 1998 with more than 20 years history. So that this model safety light curtain has been widely used and purchased because of good price and 11mm thickness.</p>
<p>Further more, we exported to Saudi Arabia much more in different length like in 1800mm length etc. Also has central opening and side opening mode for your better choice.</p>`,
    excerpt: 'Elevator light curtains use photoelectric sensors for door safety. WECO-917A model has 20+ years of history with 11mm thickness design.',
    image: 'https://www.gallopliftparts.com/wp-content/uploads/2024/04/weco-light-curtain-2.png',
    category: 'Shipping',
    created_at: '2021-07-29 00:00:00',
    sort_order: 6,
  },
];

const stmt = db.prepare(
  'INSERT INTO news (id, title, slug, content, excerpt, image, category, is_active, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)'
);

const insertAll = db.transaction((items) => {
  for (const a of items) {
    stmt.run(uuidv4(), a.title, a.slug, a.content, a.excerpt, a.image, a.category, a.sort_order, a.created_at, a.created_at);
  }
});

insertAll(articles);
console.log('Inserted', articles.length, 'news articles from WordPress blog');

// Verify
const count = db.prepare('SELECT COUNT(*) as c FROM news').get();
console.log('Total news count:', count.c);
const list = db.prepare('SELECT title, category, created_at FROM news ORDER BY sort_order ASC').all();
list.forEach((n, i) => console.log(`${i + 1}. ${n.title} - ${n.category} - ${n.created_at}`));
db.close();
