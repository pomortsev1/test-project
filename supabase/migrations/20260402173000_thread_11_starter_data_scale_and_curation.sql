create or replace function public.seed_packing_system_defaults()
returns void
language plpgsql
as $$
begin
  insert into public.categories (id, scope, profile_id, name, slug)
  values
    ('00000000-0000-0000-0000-000000000101', 'system', null, 'Documents', 'documents'),
    ('00000000-0000-0000-0000-000000000102', 'system', null, 'Tech', 'tech'),
    ('00000000-0000-0000-0000-000000000103', 'system', null, 'Clothes', 'clothes'),
    ('00000000-0000-0000-0000-000000000104', 'system', null, 'Toiletries', 'toiletries'),
    ('00000000-0000-0000-0000-000000000105', 'system', null, 'Health', 'health'),
    ('00000000-0000-0000-0000-000000000106', 'system', null, 'Misc', 'misc')
  on conflict (id) do update
  set name = excluded.name,
      slug = excluded.slug,
      updated_at = now();

  with
    legacy_catalog_items (id, category_slug, name, default_unit) as (
      values
        ('00000000-0000-0000-0000-000000000201', 'documents', 'Passport', null),
        ('00000000-0000-0000-0000-000000000202', 'documents', 'Boarding pass', null),
        ('00000000-0000-0000-0000-000000000203', 'documents', 'Wallet', null),
        ('00000000-0000-0000-0000-000000000204', 'tech', 'Mobile phone', null),
        ('00000000-0000-0000-0000-000000000205', 'tech', 'Phone charger', 'charger'),
        ('00000000-0000-0000-0000-000000000206', 'tech', 'Power bank', null),
        ('00000000-0000-0000-0000-000000000207', 'tech', 'Headphones', null),
        ('00000000-0000-0000-0000-000000000208', 'clothes', 'T-shirts', 'shirt'),
        ('00000000-0000-0000-0000-000000000209', 'clothes', 'Socks', 'pair'),
        ('00000000-0000-0000-0000-000000000210', 'clothes', 'Underwear', 'pair'),
        ('00000000-0000-0000-0000-000000000211', 'clothes', 'Trousers', 'pair'),
        ('00000000-0000-0000-0000-000000000212', 'toiletries', 'Toothbrush', null),
        ('00000000-0000-0000-0000-000000000213', 'toiletries', 'Toothpaste', 'tube'),
        ('00000000-0000-0000-0000-000000000214', 'toiletries', 'Deodorant', null),
        ('00000000-0000-0000-0000-000000000215', 'health', 'Medication', 'pack'),
        ('00000000-0000-0000-0000-000000000216', 'misc', 'Keys', null),
        ('00000000-0000-0000-0000-000000000217', 'misc', 'Water bottle', null),
        ('00000000-0000-0000-0000-000000000218', 'documents', 'ID card', null),
        ('00000000-0000-0000-0000-000000000219', 'documents', 'Travel insurance card', null),
        ('00000000-0000-0000-0000-000000000220', 'tech', 'Laptop', null),
        ('00000000-0000-0000-0000-000000000221', 'tech', 'Laptop charger', 'charger'),
        ('00000000-0000-0000-0000-000000000222', 'tech', 'Travel adapter', 'adapter'),
        ('00000000-0000-0000-0000-000000000223', 'tech', 'Earbuds', null),
        ('00000000-0000-0000-0000-000000000224', 'clothes', 'Hoodie', 'hoodie'),
        ('00000000-0000-0000-0000-000000000225', 'clothes', 'Lightweight jacket', 'jacket'),
        ('00000000-0000-0000-0000-000000000226', 'clothes', 'Pajamas', 'set'),
        ('00000000-0000-0000-0000-000000000227', 'toiletries', 'Sunscreen', 'bottle'),
        ('00000000-0000-0000-0000-000000000228', 'toiletries', 'Lip balm', null),
        ('00000000-0000-0000-0000-000000000229', 'toiletries', 'Hand sanitizer', 'bottle'),
        ('00000000-0000-0000-0000-000000000230', 'health', 'Painkillers', 'pack'),
        ('00000000-0000-0000-0000-000000000231', 'health', 'Plasters', 'pack'),
        ('00000000-0000-0000-0000-000000000232', 'misc', 'Sunglasses', null),
        ('00000000-0000-0000-0000-000000000233', 'misc', 'Tote bag', null),
        ('00000000-0000-0000-0000-000000000234', 'misc', 'Laundry bag', null)
    ),
    documents_catalog as (
      -- Documents: 118 practical system rows
      select unnest(
        array[
        'Passport', 'Boarding pass', 'Wallet', 'ID card',
        'Travel insurance card', 'Visa paperwork', 'Residence permit', 'Driver''s license',
        'Student ID', 'Work ID badge', 'Hotel reservation printout', 'Flight itinerary',
        'Train ticket', 'Bus ticket', 'Ferry ticket', 'Car rental confirmation',
        'Event ticket', 'Museum pass', 'Transit pass', 'Parking reservation',
        'Vaccination card', 'Prescription copy', 'Emergency contact sheet', 'Blood type card',
        'Medical summary printout', 'Travel consent letter', 'Pet vaccination record', 'Pet travel documents',
        'International driving permit', 'Roadside assistance card', 'Credit card', 'Debit card',
        'Foreign currency cash', 'Local currency cash', 'Expense receipts envelope', 'Travel budget sheet',
        'Tax refund forms', 'Loyalty cards pouch', 'Spare card', 'SIM registration form',
        'Conference agenda', 'Meeting notes notebook', 'Business cards', 'Client briefing printout',
        'Presentation clicker instructions', 'Freelance contract copy', 'Equipment loan agreement', 'Shipping label printout',
        'Coworking pass', 'Invitation letter', 'Child travel consent form', 'School holiday letter',
        'Family itinerary printout', 'Custody documents copy', 'Baby vaccination record', 'Emergency pickup authorization',
        'Pediatrician contact card', 'Family hotel booking printout', 'Kids activity reservations', 'Theme park tickets',
        'Embassy contact list', 'Lost-wallet checklist', 'Copies of passport', 'Copies of ID card',
        'Copies of travel insurance', 'Luggage inventory printout', 'Home insurance contact card', 'Accommodation address card',
        'Language cheat sheet', 'Backup passport photo', 'Cruise documents', 'Ski pass receipt',
        'Camping reservation', 'Festival wristband confirmation', 'Diving certification card', 'Fishing license',
        'Golf tee-time confirmation', 'Wedding invitation', 'Formal event schedule', 'Rental apartment check-in guide',
        'Printed boarding pass', 'Printed flight itinerary', 'Printed hotel reservation', 'Printed train ticket',
        'Printed bus ticket', 'Printed ferry ticket', 'Printed car rental confirmation', 'Printed conference agenda',
        'Printed maps directions', 'Printed vaccination certificate', 'Digital backup of passport', 'Digital backup of ID card',
        'Digital backup of driver''s license', 'Digital backup of travel insurance', 'Digital backup of vaccination card', 'Digital backup of visa paperwork',
        'Digital backup of hotel reservation', 'Digital backup of flight itinerary', 'Digital backup of emergency contacts', 'Digital backup of medical summary',
        'Copies of credit cards', 'Copies of debit cards', 'Copies of prescriptions', 'Copies of pet documents',
        'Copies of custody documents', 'Copies of event tickets', 'Copies of rental agreement', 'Copies of work ID badge',
        'Work trip itinerary', 'Work trip expense policy', 'Work trip meeting schedule', 'Work trip conference badge QR code',
        'Work trip hotel invoice folder', 'Family trip medical summary', 'Family trip theme park booking', 'Family trip kid pickup note',
        'Family trip snack receipts envelope', 'Family trip rental check-in notes'
        ]::text[]
      ) as name
    ),
    tech_catalog as (
      -- Tech: 224 practical system rows
      select unnest(
        array[
        'Mobile phone', 'Phone charger', 'Power bank', 'Headphones',
        'Laptop', 'Laptop charger', 'Travel adapter', 'Earbuds',
        'Tablet', 'Tablet charger', 'E-reader', 'E-reader charger',
        'Smartwatch', 'Watch charger', 'Bluetooth speaker', 'Portable hotspot',
        'SIM card eject tool', 'USB-C cable', 'Lightning cable', 'Micro-USB cable',
        'Extension cord', 'Outlet splitter', 'Universal adapter', 'Spare charging brick',
        'Wireless charger', 'MagSafe charger', 'Portable SSD', 'USB flash drive',
        'Memory card case', 'Camera battery charger', 'DSLR camera', 'Mirrorless camera',
        'Action camera', 'Compact camera', 'Camera lens cloth', 'Camera lens cap',
        'Camera strap', 'Tripod', 'Mini tripod', 'Gimbal stabilizer',
        'Noise-canceling headphones', 'Sleep headphones', 'Wired earbuds', 'Audio splitter',
        'USB-C hub', 'HDMI adapter', 'Ethernet adapter', 'Laptop stand',
        'Foldable keyboard', 'Wireless mouse', 'Mouse pad', 'Presentation clicker',
        'Portable monitor', 'Webcam', 'Headset microphone', 'USB microphone',
        'Cable organizer', 'Tech pouch', 'Cord labels', 'Screen cleaning wipes',
        'International power strip', 'Battery case', 'Rechargeable AA batteries', 'Rechargeable AAA batteries',
        'Battery storage case', 'Portable fan', 'Mini flashlight', 'Bike light charger',
        'GPS tracker', 'Luggage tracker', 'Smartphone tripod', 'Phone selfie stick',
        'Phone grip', 'Phone waterproof pouch', 'Phone case', 'Laptop sleeve',
        'Tablet sleeve', 'Camera cube insert', 'Drone', 'Drone controller',
        'Drone batteries', 'Drone propeller guards', 'Drone landing pad', 'Game console',
        'Game controller', 'Console charging cable', 'Streaming stick', 'Remote control',
        'Portable projector', 'Projector HDMI cable', 'Electric toothbrush charger', 'Beard trimmer charger',
        'Hair tool adapter', 'Smart ring charger', 'Portable alarm clock', 'Digital luggage scale',
        'Translation device', 'Pocket Wi-Fi charger', 'External DVD drive', 'USB-C to USB-A adapter',
        'USB-C to HDMI adapter', 'USB-C to Ethernet adapter', 'USB-C to SD card reader', 'Lightning to USB adapter',
        'Cable clip set', 'Spare wall plug', 'Car charger', '12V USB adapter',
        'Dash cam', 'Dash cam memory card', 'Phone stand', 'Phone screen protector',
        'Phone cleaning kit', 'Phone case', 'Phone charging cable', 'Laptop stand',
        'Laptop screen protector', 'Laptop cleaning kit', 'Laptop case', 'Laptop charging cable',
        'Tablet stand', 'Tablet screen protector', 'Tablet cleaning kit', 'Tablet case',
        'Tablet charging cable', 'Camera stand', 'Camera screen protector', 'Camera cleaning kit',
        'Camera case', 'Camera charging cable', 'Drone stand', 'Drone screen protector',
        'Drone cleaning kit', 'Drone case', 'Drone charging cable', 'Watch stand',
        'Watch screen protector', 'Watch cleaning kit', 'Watch case', 'Watch charging cable',
        'E-reader stand', 'E-reader screen protector', 'E-reader cleaning kit', 'E-reader case',
        'E-reader charging cable', 'USB-C adapter', 'USB-C cable', 'USB-C extension',
        'Lightning adapter', 'Lightning cable', 'Lightning extension', 'Micro-USB adapter',
        'Micro-USB cable', 'Micro-USB extension', 'HDMI adapter', 'HDMI reader',
        'HDMI cable', 'Ethernet adapter', 'Ethernet reader', 'Ethernet cable',
        'SD card adapter', 'SD card reader', 'SD card cable', 'Portable keyboard',
        'Portable mouse', 'Portable tripod', 'Portable power strip', 'Portable charging dock',
        'Foldable keyboard', 'Foldable mouse', 'Foldable tripod', 'Foldable power strip',
        'Foldable charging dock', 'Travel keyboard', 'Travel mouse', 'Travel tripod',
        'Travel power strip', 'Travel charging dock', 'Over-ear headphones', 'On-ear headphones',
        'Kids headphones', 'Wireless earbuds', 'Wireless headset', 'Wired earbuds',
        'Wired headset', 'USB-C earbuds', 'USB-C headset', 'Bluetooth earbuds',
        'Bluetooth headset', 'Compact flashlight', 'Compact reading light', 'Compact ring light',
        'Rechargeable flashlight', 'Rechargeable reading light', 'Rechargeable ring light', 'LED flashlight',
        'LED reading light', 'LED ring light', 'Laptop privacy screen', 'Laptop mount',
        'Laptop holder', 'Tablet privacy screen', 'Tablet mount', 'Tablet holder',
        'Phone privacy screen', 'Phone mount', 'Phone holder', 'Camera privacy screen',
        'Camera mount', 'Camera holder', 'Multi-port charger', 'Multi-port charging brick',
        'Multi-port USB hub', 'Fast charger', 'Fast charging brick', 'Fast USB hub',
        'Car charging station', 'Car wireless charger', 'Car clock', 'Desk charging station',
        'Desk wireless charger', 'Desk clock', 'Bedside charging station', 'Bedside wireless charger',
        'Bedside clock', 'Camera battery case', 'Camera propeller set', 'Camera filter kit',
        'Camera charging hub', 'Drone battery case', 'Drone propeller set', 'Drone filter kit',
        'Drone charging hub'
        ]::text[]
      ) as name
    ),
    clothes_catalog as (
      -- Clothes: 268 practical system rows
      select unnest(
        array[
        'Shorts', 'Leggings', 'Jacket', 'Rain jacket',
        'Vest', 'Coat', 'Cotton T-shirt', 'Cotton Long-sleeve shirt',
        'Cotton Polo shirt', 'Merino T-shirt', 'Merino Long-sleeve shirt', 'Merino Polo shirt',
        'Quick-dry T-shirt', 'Quick-dry Long-sleeve shirt', 'Quick-dry Polo shirt', 'Linen T-shirt',
        'Linen Long-sleeve shirt', 'Linen Polo shirt', 'Thermal T-shirt', 'Thermal Long-sleeve shirt',
        'Thermal Polo shirt', 'Tank top', 'Button-down shirt', 'Blouse',
        'Tunic top', 'Workout top', 'Base layer top', 'Compression shirt',
        'Rash guard', 'Sun shirt', 'Sleep shirt', 'Sweater',
        'Cardigan', 'Hoodie', 'Fleece pullover', 'Sweatshirt',
        'Jeans', 'Chinos', 'Skirt', 'Dress',
        'Jumpsuit', 'Swimsuit', 'Bikini top', 'Bikini bottoms',
        'Swim trunks', 'Cover-up', 'Pajamas', 'Sleep shorts',
        'Sleep pants', 'Bathrobe', 'Sandals', 'Flip-flops',
        'Slippers', 'Loafers', 'Boots', 'Snow boots',
        'Water shoes', 'Dress socks', 'Sports bra', 'Bra',
        'Undershirt', 'Belt', 'Beanie', 'Sun hat',
        'Cap', 'Scarf', 'Gloves', 'Mittens',
        'Tie', 'Pocket square', 'Jewelry pouch', 'Watch',
        'Walking shoes', 'Lightweight Jacket', 'Lightweight Rain jacket', 'Lightweight Vest',
        'Lightweight Coat', 'Waterproof Jacket', 'Waterproof Rain jacket', 'Waterproof Vest',
        'Waterproof Coat', 'Packable Jacket', 'Packable Rain jacket', 'Packable Vest',
        'Packable Coat', 'Insulated Jacket', 'Insulated Rain jacket', 'Insulated Vest',
        'Insulated Coat', 'Windproof Jacket', 'Windproof Rain jacket', 'Windproof Vest',
        'Windproof Coat', 'Quilted Jacket', 'Quilted Rain jacket', 'Quilted Vest',
        'Quilted Coat', 'Cotton Shorts', 'Cotton Trousers', 'Cotton Leggings',
        'Cotton Joggers', 'Stretch Shorts', 'Stretch Trousers', 'Stretch Leggings',
        'Stretch Joggers', 'Quick-dry Shorts', 'Quick-dry Trousers', 'Quick-dry Leggings',
        'Quick-dry Joggers', 'Linen Shorts', 'Linen Trousers', 'Linen Leggings',
        'Linen Joggers', 'Thermal Shorts', 'Thermal Trousers', 'Thermal Leggings',
        'Thermal Joggers', 'Water-resistant Shorts', 'Water-resistant Trousers', 'Water-resistant Leggings',
        'Water-resistant Joggers', 'Ankle Socks', 'Ankle Hiking socks', 'Crew Socks',
        'Crew Hiking socks', 'Wool Socks', 'Wool Hiking socks', 'Compression Socks',
        'Compression Hiking socks', 'No-show Socks', 'No-show Hiking socks', 'Thermal Socks',
        'Thermal Hiking socks', 'Everyday underwear', 'Seamless underwear', 'Sports underwear',
        'Thermal underwear', 'Maternity underwear', 'Quick-dry underwear', 'Walking shoes',
        'Running shoes', 'Trail shoes', 'Dress shoes',
        'Waterproof shoes', 'Slip-on shoes', 'Sleep shorts', 'Sleep pants',
        'Sleep top', 'Sleep set', 'Sleep robe', 'Lounge shorts',
        'Lounge pants', 'Lounge top', 'Lounge set', 'Lounge robe',
        'Maternity shorts', 'Maternity pants', 'Maternity top', 'Maternity set',
        'Maternity robe', 'Kids shorts', 'Kids pants', 'Kids top',
        'Kids set', 'Kids robe', 'Baby shorts', 'Baby pants',
        'Baby top', 'Baby set', 'Baby robe', 'Formal dress',
        'Formal shirt', 'Formal trousers', 'Formal pants', 'Formal top',
        'Business dress', 'Business shirt', 'Business trousers', 'Business pants',
        'Business top', 'Beach shorts', 'Beach top', 'Beach set',
        'Beach cover-up', 'Gym shorts', 'Gym top', 'Gym set',
        'Gym cover-up', 'Fleece jacket', 'Fleece vest', 'Puffer jacket',
        'Puffer vest', 'Denim jacket', 'Denim vest', 'Softshell jacket',
        'Softshell vest', 'Sherpa jacket', 'Sherpa vest', 'Rain jacket',
        'Rain vest', 'Hiking leggings', 'Hiking shorts', 'Hiking top',
        'Hiking socks', 'Hiking hat', 'Running leggings', 'Running shorts',
        'Running top', 'Running socks', 'Running hat', 'Yoga leggings',
        'Yoga shorts', 'Yoga top', 'Yoga socks', 'Yoga hat',
        'Cycling leggings', 'Cycling shorts', 'Cycling top', 'Cycling socks',
        'Cycling hat', 'Ski leggings', 'Ski shorts', 'Ski top',
        'Ski socks', 'Ski hat', 'Travel leggings', 'Travel shorts',
        'Travel top', 'Travel socks', 'Travel hat', 'Beach hat',
        'Beach shorts', 'Beach top', 'Beach cover-up', 'Beach sandals',
        'Leather belt', 'Canvas belt', 'Packable hat', 'Packable cap',
        'Wide-brim hat', 'Wide-brim cap', 'Bucket hat', 'Bucket cap',
        'Silk sleep set', 'Silk base layer', 'Silk scarf', 'Cotton sleep set',
        'Cotton base layer', 'Cotton scarf', 'Thermal sleep set', 'Thermal base layer',
        'Thermal scarf', 'Merino sleep set', 'Merino base layer', 'Merino scarf',
        'Cashmere sweater', 'Cashmere cardigan', 'Cable-knit sweater', 'Cable-knit cardigan',
        'Mock-neck sweater', 'Mock-neck cardigan', 'V-neck sweater', 'V-neck cardigan',
        'Travel dress', 'Travel shirt', 'Travel trousers', 'Work dress',
        'Work shirt', 'Work trousers', 'Weekend dress', 'Weekend shirt',
        'Weekend trousers', 'Dinner dress', 'Dinner shirt', 'Dinner trousers'
        ]::text[]
      ) as name
    ),
    toiletries_catalog as (
      -- Toiletries: 187 practical system rows
      select unnest(
        array[
        'Toothbrush', 'Toothpaste', 'Deodorant', 'Sunscreen',
        'Lip balm', 'Hand sanitizer', 'Dental floss', 'Mouthwash',
        'Tongue scraper', 'Retainer case', 'Retainer tablets', 'Whitening strips',
        'Electric toothbrush', 'Toothbrush cover', 'Shampoo', 'Conditioner',
        'Body wash', 'Face wash', 'Moisturizer', 'Hand cream',
        'Body lotion', 'After-sun lotion', 'Micellar water', 'Contact lens solution',
        'Shampoo bar', 'Conditioner bar', 'Soap bar', 'Solid deodorant',
        'Solid perfume', 'Solid lotion bar', 'Razor', 'Shaving cream',
        'Aftershave', 'Tweezers', 'Nail clippers', 'Nail file',
        'Hairbrush', 'Comb', 'Hair ties', 'Bobby pins',
        'Dry shampoo', 'Hair oil', 'Leave-in conditioner', 'Curl cream',
        'Hair gel', 'Hair spray', 'Heat protectant spray', 'Makeup remover wipes',
        'Cotton pads', 'Cotton swabs', 'Makeup bag', 'Foundation',
        'Concealer', 'Powder', 'Mascara', 'Eyeliner',
        'Blush', 'Lipstick', 'Tinted moisturizer', 'Makeup brushes',
        'Beauty sponge', 'Perfume atomizer', 'Body mist', 'Face sunscreen',
        'Aloe gel', 'Foot cream', 'Anti-chafe balm', 'Blister patches',
        'Laundry soap sheets', 'Stain remover pen', 'Lint roller', 'Tissue pack',
        'Wet wipes', 'Pocket mirror', 'Shower cap', 'Loofah',
        'Exfoliating glove', 'Travel towel', 'Microfiber towel', 'Silicone travel bottle set',
        'Silicone cotton swab case', 'Beard trimmer oil', 'Cooling sunscreen', 'Aloe sunscreen',
        'Mineral sunscreen', 'Spray sunscreen', 'Cooling after-sun gel', 'Aloe after-sun gel',
        'Mineral sunscreen stick', 'Travel-size Shampoo', 'Travel-size Conditioner', 'Travel-size Body wash',
        'Travel-size Face wash', 'Travel-size Moisturizer', 'Travel-size Hand cream', 'Travel-size Body lotion',
        'Travel-size After-sun lotion', 'Travel-size Micellar water', 'Travel-size Contact lens solution', 'Refillable Shampoo',
        'Refillable Conditioner', 'Refillable Body wash', 'Refillable Face wash', 'Refillable Moisturizer',
        'Refillable Hand cream', 'Refillable Body lotion', 'Refillable After-sun lotion', 'Refillable Micellar water',
        'Refillable Contact lens solution', 'Hydrating moisturizer', 'Hydrating cleanser', 'Hydrating face mist',
        'Hydrating face cream', 'Mattifying moisturizer', 'Mattifying cleanser', 'Mattifying face mist',
        'Mattifying face cream', 'Sensitive skin moisturizer', 'Sensitive skin cleanser', 'Sensitive skin face mist',
        'Sensitive skin face cream', 'Fragrance-free moisturizer', 'Fragrance-free cleanser', 'Fragrance-free face mist',
        'Fragrance-free face cream', 'SPF moisturizer', 'SPF cleanser', 'SPF face mist',
        'SPF face cream', 'Volumizing shampoo', 'Volumizing conditioner', 'Volumizing hair mask',
        'Curl-defining shampoo', 'Curl-defining conditioner', 'Curl-defining hair mask', 'Frizz-control shampoo',
        'Frizz-control conditioner', 'Frizz-control hair mask', 'Moisturizing shampoo', 'Moisturizing conditioner',
        'Moisturizing hair mask', 'Clarifying shampoo', 'Clarifying conditioner', 'Clarifying hair mask',
        'Waterproof mascara', 'Waterproof eyeliner', 'Waterproof lipstick', 'Waterproof makeup palette',
        'Travel-size mascara', 'Travel-size eyeliner', 'Travel-size lipstick', 'Travel-size makeup palette',
        'Mini mascara', 'Mini eyeliner', 'Mini lipstick', 'Mini makeup palette',
        'Disposable makeup remover pad', 'Disposable travel bottle set', 'Disposable cotton swab case', 'Reusable makeup remover pad',
        'Reusable travel bottle set', 'Reusable cotton swab case', 'Beard cream', 'Beard wash',
        'Beard balm', 'Face cream', 'Face wash', 'Face balm',
        'Body cream', 'Body wash', 'Body balm', 'Foot cream',
        'Foot wash', 'Foot balm', 'Hand cream', 'Hand wash',
        'Hand balm', 'Sensitive shampoo', 'Sensitive conditioner', 'Sensitive detangler',
        'Dry shampoo', 'Dry conditioner', 'Dry detangler', 'Curly shampoo',
        'Curly conditioner', 'Curly detangler', 'Color-safe shampoo', 'Color-safe conditioner',
        'Color-safe detangler', 'Fine hair shampoo', 'Fine hair conditioner', 'Fine hair detangler'
        ]::text[]
      ) as name
    ),
    health_catalog as (
      -- Health: 149 practical system rows
      select unnest(
        array[
        'Medication', 'Painkillers', 'Plasters', 'First-aid kit',
        'Prescription medicine organizer', 'Prescription copy', 'Allergy tablets', 'Cold medicine',
        'Cough drops', 'Motion sickness tablets', 'Antacid tablets', 'Anti-diarrheal tablets',
        'Rehydration salts', 'Electrolyte tablets', 'Sleep aid', 'Melatonin',
        'Thermometer', 'Digital thermometer battery', 'Fever reducer', 'Nasal spray',
        'Saline spray', 'Eye drops', 'Contact lens rewetting drops', 'Insect repellent',
        'After-bite cream', 'Anti-itch cream', 'Sunburn gel', 'Antibiotic ointment',
        'Bandage roll', 'Sterile gauze', 'Medical tape', 'Finger splint',
        'Elastic bandage', 'Knee brace', 'Ankle brace', 'Compression sleeves',
        'Hand warmers', 'Cold pack', 'Heat patch', 'Blister prevention tape',
        'Moleskin', 'Ear plugs', 'Face masks', 'Hand cream for eczema',
        'Sanitary pads', 'Tampons', 'Menstrual cup', 'Period pain relief patches',
        'Ovulation medication', 'Prenatal vitamins', 'Baby medicine syringe', 'Children''s fever medicine',
        'Children''s allergy medicine', 'Hydration powder', 'Protein bars', 'Vitamin organizer',
        'Magnesium tablets', 'Travel pillow for neck support', 'Back pain relief patch', 'Disposable eye mask',
        'Disposable hot pack', 'Disposable ice pack', 'Kids allergy tablets', 'Kids cold medicine',
        'Kids cough syrup', 'Kids pain relief', 'Adult allergy tablets', 'Adult cold medicine',
        'Adult cough syrup', 'Adult pain relief', 'Nighttime allergy tablets', 'Nighttime cold medicine',
        'Nighttime cough syrup', 'Nighttime pain relief', 'Daytime allergy tablets', 'Daytime cold medicine',
        'Daytime cough syrup', 'Daytime pain relief', 'Non-drowsy allergy tablets', 'Non-drowsy cold medicine',
        'Non-drowsy cough syrup', 'Non-drowsy pain relief', 'Small bandages', 'Small compression wrap',
        'Small sterile pads', 'Medium bandages', 'Medium compression wrap', 'Medium sterile pads',
        'Large bandages', 'Large compression wrap', 'Large sterile pads', 'Waterproof plasters',
        'Fabric plasters', 'Knuckle plasters', 'Heel plasters', 'Travel pill organizer',
        'Weekly pill organizer', 'Daily pill organizer', 'Hydration gummies', 'Hydration capsules',
        'Hydration powder sticks', 'Immune support gummies', 'Immune support capsules', 'Immune support powder sticks',
        'Sleep support gummies', 'Sleep support capsules', 'Sleep support powder sticks', 'Stress support gummies',
        'Stress support capsules', 'Stress support powder sticks', 'Reusable hot pack', 'Reusable ice pack',
        'Reusable eye mask', 'Gel hot pack', 'Gel ice pack', 'Gel eye mask',
        'Mosquito repellent spray', 'Mosquito after-bite gel', 'Tick repellent spray', 'Tick after-bite gel',
        'Bug repellent spray', 'Bug after-bite gel', 'Period heat patch', 'Period relief patch',
        'Back heat patch', 'Back relief patch', 'Neck heat patch', 'Neck relief patch',
        'Shoulder heat patch', 'Shoulder relief patch', 'Sports first-aid kit', 'Sports recovery gel',
        'Sports muscle rub', 'Travel first-aid kit', 'Travel recovery gel', 'Travel muscle rub',
        'Daily first-aid kit', 'Daily recovery gel', 'Daily muscle rub', 'Electrolyte tablets',
        'Electrolyte drink mix', 'Electrolyte gummies', 'Vitamin C tablets', 'Vitamin C drink mix',
        'Vitamin C gummies', 'Iron tablets', 'Iron drink mix', 'Iron gummies',
        'Magnesium tablets', 'Magnesium drink mix', 'Magnesium gummies'
        ]::text[]
      ) as name
    ),
    misc_catalog as (
      -- Misc: 282 practical system rows
      select unnest(
        array[
        'Keys', 'Water bottle', 'Sunglasses', 'Tote bag',
        'Laundry bag', 'Reusable shopping bag', 'Neck pillow', 'Sleep mask',
        'Travel umbrella', 'Pen', 'Notebook', 'Snacks',
        'Coffee sachets', 'Tea bags', 'Collapsible cup', 'Cutlery set',
        'Reusable straw', 'Luggage scale', 'Luggage tags', 'Padlock',
        'TSA lock', 'Daypack', 'Packable backpack', 'Crossbody bag',
        'Waist pack', 'Beach bag', 'Dry bag', 'Packing cubes',
        'Shoe bags', 'Dirty laundry pouch', 'Passport holder', 'Money belt',
        'Card holder', 'Coin pouch', 'Car keys', 'House keys',
        'Spare keys', 'Doorstop', 'Mini sewing kit', 'Safety pins',
        'Duct tape roll', 'Zip ties', 'Carabiners', 'Reusable tote',
        'Foldable tote', 'Picnic blanket', 'Travel pillowcase', 'Compact blanket',
        'Seat cushion', 'Eye mask', 'White noise machine', 'Portable humidifier',
        'Mini fan', 'Pocket tissues', 'Reusable bottle brush', 'Dish soap sheets',
        'Sink stopper', 'Clothesline', 'Travel hangers', 'Microfiber blanket',
        'Cooling towel', 'Handheld steamer', 'Wrinkle release spray', 'Portable lint brush',
        'Reading glasses', 'Blue-light glasses', 'Spare glasses case', 'Sunglasses case',
        'Binoculars', 'Deck of cards', 'Travel journal', 'Guidebook',
        'Phrasebook', 'Maps printout', 'Portable chess set', 'Puzzle book',
        'Coloring kit', 'Crayons', 'Stuffed toy', 'Kids headphones',
        'Stroller fan', 'Stroller organizer', 'Baby carrier', 'Portable high chair cover',
        'Sippy cup', 'Formula dispenser', 'Baby bibs', 'Pacifiers',
        'Pacifier clips', 'Changing pad', 'Diaper cream', 'Disposable bags',
        'Pet leash', 'Pet collapsible bowl', 'Pet waste bags', 'Pet calming treats',
        'Pet food scoop', 'Picnic utensils', 'Beach towel', 'Swim goggles',
        'Snorkel mask', 'Waterproof phone pouch', 'Portable clothes clips', 'Camping mug',
        'Headlamp', 'Lantern', 'Pocket knife', 'Multi-tool',
        'Fire starter', 'Bug net', 'Rain cover for backpack', 'Trekking poles',
        'Ski gloves', 'Ski goggles', 'Helmet bag', 'Yoga strap',
        'Resistance bands', 'Massage ball', 'Foam roller mini', 'Travel yoga mat',
        'Portable door alarm', 'Window alarm', 'Portable safe', 'Spare batteries',
        'Mini notebook', 'Postal stamps', 'Gift bag', 'Greeting card',
        'Portable stain wipes', 'Pet travel blanket', 'Pet seat cover', 'Pet food container',
        'Pet toy pouch', 'Door alarm', 'Door wedge alarm', 'Compression packing cube',
        'Compression shoe bag', 'Compression laundry pouch', 'Compression zip pouch',
        'Waterproof packing cube', 'Waterproof shoe bag', 'Waterproof laundry pouch', 'Waterproof zip pouch',
        'Mesh packing cube', 'Mesh shoe bag', 'Mesh laundry pouch', 'Mesh zip pouch',
        'Large packing cube', 'Large shoe bag', 'Large laundry pouch', 'Large zip pouch',
        'Small packing cube', 'Small shoe bag', 'Small laundry pouch', 'Small zip pouch',
        'Beach towel', 'Beach blanket', 'Beach organizer kit', 'Beach snack box',
        'Hiking towel', 'Hiking blanket', 'Hiking organizer kit', 'Hiking snack box',
        'Camping towel', 'Camping blanket', 'Camping organizer kit', 'Camping snack box',
        'Road trip towel', 'Road trip blanket', 'Road trip organizer kit', 'Road trip snack box',
        'Picnic towel', 'Picnic blanket', 'Picnic organizer kit', 'Picnic snack box',
        'Gym towel', 'Gym blanket', 'Gym organizer kit', 'Gym snack box',
        'Baby travel blanket', 'Baby spill-proof cup', 'Baby snack container', 'Baby toy pouch',
        'Toddler travel blanket', 'Toddler spill-proof cup', 'Toddler snack container', 'Toddler toy pouch',
        'Kids travel blanket', 'Kids spill-proof cup', 'Kids snack container', 'Kids toy pouch',
        'Portable seat cushion', 'Portable footrest', 'Inflatable seat cushion', 'Inflatable footrest',
        'Foldable laundry basket', 'Foldable storage bin', 'Foldable seat cushion', 'Foldable footrest',
        'Collapsible laundry basket', 'Collapsible storage bin', 'Collapsible seat cushion', 'Collapsible footrest',
        'RFID passport holder', 'RFID wallet', 'RFID card sleeve', 'Leather passport holder',
        'Leather wallet', 'Leather card sleeve', 'Slim passport holder', 'Slim wallet',
        'Slim card sleeve', 'Zip passport holder', 'Zip wallet', 'Zip card sleeve',
        'Emergency alarm', 'Emergency flashlight', 'Emergency whistle', 'Personal alarm',
        'Personal flashlight', 'Personal whistle', 'Travel notebook', 'Travel planner',
        'Travel calendar', 'Pocket notebook', 'Pocket planner', 'Pocket calendar',
        'Desk notebook', 'Desk planner', 'Desk calendar', 'Mini sewing kit',
        'Mini shoehorn', 'Mini stain remover kit', 'Travel sewing kit', 'Travel shoehorn',
        'Travel stain remover kit', 'Portable sewing kit', 'Portable shoehorn', 'Portable stain remover kit',
        'Beach cooler bag', 'Beach tablecloth clip set', 'Beach utensil roll', 'Beach drink caddy',
        'Camp cooler bag', 'Camp tablecloth clip set', 'Camp utensil roll', 'Camp drink caddy',
        'Picnic cooler bag', 'Picnic tablecloth clip set', 'Picnic utensil roll', 'Picnic drink caddy',
        'Road trip cooler bag', 'Road trip tablecloth clip set', 'Road trip utensil roll', 'Road trip drink caddy',
        'Waterproof bottle carrier', 'Waterproof lunch bag', 'Waterproof storage tote', 'Insulated bottle carrier',
        'Insulated lunch bag', 'Insulated storage tote', 'Collapsible bottle carrier', 'Collapsible lunch bag',
        'Collapsible storage tote', 'Magnetic reading light', 'Magnetic tent light', 'Magnetic bag light',
        'Clip-on reading light', 'Clip-on tent light', 'Clip-on bag light', 'LED reading light',
        'LED tent light', 'LED bag light', 'Travel organizer pouch', 'Travel snack pouch',
        'Travel wipes case', 'Family organizer pouch', 'Family snack pouch', 'Family wipes case',
        'Kids organizer pouch', 'Kids snack pouch', 'Kids wipes case', 'Pet organizer pouch',
        'Pet snack pouch', 'Pet wipes case'
        ]::text[]
      ) as name
    ),
    catalog_seed as (
      select 'documents'::text as category_slug, name from documents_catalog
      union all select 'tech'::text, name from tech_catalog
      union all select 'clothes'::text, name from clothes_catalog
      union all select 'toiletries'::text, name from toiletries_catalog
      union all select 'health'::text, name from health_catalog
      union all select 'misc'::text, name from misc_catalog
    ),
    catalog_source as (
      select id::uuid as id, category_slug, name, default_unit
      from legacy_catalog_items
      union all
      select null::uuid as id, category_slug, name, null::text as default_unit
      from catalog_seed
    ),
    catalog_deduped as (
      select distinct on (category_slug, public.normalize_name(name))
        id,
        category_slug,
        btrim(name) as name,
        public.normalize_name(name) as normalized_name,
        default_unit
      from catalog_source
      order by category_slug, public.normalize_name(name), (id is null), name
    ),
    catalog_prepared as (
      select
        coalesce(
          id,
          (
            substr(hash_value, 1, 8) || '-' ||
            substr(hash_value, 9, 4) || '-' ||
            substr(hash_value, 13, 4) || '-' ||
            substr(hash_value, 17, 4) || '-' ||
            substr(hash_value, 21, 12)
          )::uuid
        ) as id,
        category_slug,
        name,
        normalized_name,
        coalesce(
          default_unit,
          case
            when category_slug = 'tech' and normalized_name like '% charger' then 'charger'
            when category_slug = 'tech' and normalized_name like '% charging cable' then 'cable'
            when category_slug = 'tech' and normalized_name like '% cable' then 'cable'
            when category_slug = 'tech' and normalized_name like '% adapter' then 'adapter'
            when category_slug = 'tech' and normalized_name like '% batteries' then 'battery'
            when category_slug = 'tech' and normalized_name like '% battery%' then 'battery'
            when category_slug = 'tech' and normalized_name like '% headphones' then 'pair'
            when category_slug = 'tech' and normalized_name like '% earbuds' then 'pair'
            when category_slug = 'tech' and normalized_name like '% tripod' then 'tripod'
            when category_slug = 'clothes' and (normalized_name like '% socks' or normalized_name like '% hiking socks' or normalized_name like '% underwear' or normalized_name like '% shoes' or normalized_name in ('sandals', 'flip-flops', 'slippers', 'loafers', 'boots', 'snow boots', 'water shoes', 'gloves', 'mittens')) then 'pair'
            when category_slug = 'clothes' and normalized_name like '% t-shirts' then 't-shirt'
            when category_slug = 'clothes' and (normalized_name like '% trousers' or normalized_name like '% pants' or normalized_name like '% shorts' or normalized_name like '% leggings' or normalized_name like '% joggers' or normalized_name in ('jeans', 'chinos')) then 'pair'
            when category_slug = 'clothes' and normalized_name like '% hat' then 'hat'
            when category_slug = 'clothes' and normalized_name like '% cap' then 'cap'
            when category_slug = 'clothes' and normalized_name like '% swimsuit' then 'swimsuit'
            when category_slug = 'clothes' and normalized_name like '% pajamas' then 'set'
            when category_slug = 'toiletries' and normalized_name = 'toothpaste' then 'tube'
            when category_slug = 'toiletries' and normalized_name = 'lip balm' then 'tube'
            when category_slug = 'toiletries' and (normalized_name like '% wipes' or normalized_name like '% pads' or normalized_name like '% swabs' or normalized_name like '% tablets' or normalized_name like '% strips' or normalized_name like '% patches' or normalized_name like '% sheets') then 'pack'
            when category_slug = 'toiletries' and (normalized_name like '% shampoo' or normalized_name like '% conditioner' or normalized_name like '% wash' or normalized_name like '% lotion' or normalized_name like '% moisturizer' or normalized_name like '% sunscreen%' or normalized_name like '% mist' or normalized_name like '% spray' or normalized_name like '% solution' or normalized_name like '% gel' or normalized_name like '% cream') then 'bottle'
            when category_slug = 'health' and (normalized_name = 'medication' or normalized_name like '% tablets' or normalized_name like '% gummies' or normalized_name like '% capsules' or normalized_name like '% powder' or normalized_name like '% patch' or normalized_name like '% bars' or normalized_name like '% salts' or normalized_name like '% drops') then 'pack'
            when category_slug = 'health' and (normalized_name like '% spray' or normalized_name like '% gel' or normalized_name like '% ointment') then 'bottle'
            when category_slug = 'misc' and normalized_name like '% cubes' then 'set'
            when category_slug = 'misc' and normalized_name like '% bag' then 'bag'
            when category_slug = 'misc' and normalized_name like '% pouch' then 'pouch'
            when category_slug = 'misc' and normalized_name like '% towel' then 'towel'
            when category_slug = 'misc' and (normalized_name like '% notebook' or normalized_name like '% journal' or normalized_name like '% guidebook' or normalized_name like '% phrasebook' or normalized_name like '% planner' or normalized_name like '% calendar' or normalized_name like '% puzzle book') then 'book'
            when category_slug = 'misc' and (normalized_name like '% goggles' or normalized_name like '% glasses') then 'pair'
            when category_slug = 'misc' and normalized_name = 'snacks' then 'pack'
            else null
          end
        ) as default_unit
      from (
        select
          id,
          category_slug,
          name,
          normalized_name,
          default_unit,
          md5('packing-system-catalog:' || category_slug || ':' || normalized_name) as hash_value
        from catalog_deduped
      ) as hashed_catalog
    )
  insert into public.catalog_items (id, scope, profile_id, category_id, name, normalized_name, default_unit)
  select
    catalog_prepared.id,
    'system',
    null,
    case catalog_prepared.category_slug
      when 'documents' then '00000000-0000-0000-0000-000000000101'
      when 'tech' then '00000000-0000-0000-0000-000000000102'
      when 'clothes' then '00000000-0000-0000-0000-000000000103'
      when 'toiletries' then '00000000-0000-0000-0000-000000000104'
      when 'health' then '00000000-0000-0000-0000-000000000105'
      when 'misc' then '00000000-0000-0000-0000-000000000106'
    end::uuid as category_id,
    catalog_prepared.name,
    catalog_prepared.normalized_name,
    catalog_prepared.default_unit
  from catalog_prepared
  on conflict (id) do update
  set category_id = excluded.category_id,
      name = excluded.name,
      normalized_name = excluded.normalized_name,
      default_unit = excluded.default_unit,
      updated_at = now();
end;
$$;

create or replace function public.get_starter_template_blueprint()
returns table (
  category_name text,
  catalog_item_id uuid,
  item_name text,
  quantity numeric,
  unit text,
  sort_order integer
)
language sql
stable
as $$
  with starter_items (category_slug, item_name, quantity, unit, sort_order) as (
    values
      ('documents', 'Passport', null::numeric, null::text, 10),
      ('documents', 'Boarding pass', null::numeric, null::text, 20),
      ('documents', 'Wallet', null::numeric, null::text, 30),
      ('documents', 'ID card', null::numeric, null::text, 40),
      ('documents', 'Travel insurance card', null::numeric, null::text, 50),
      ('documents', 'Driver''s license', null::numeric, null::text, 60),
      ('documents', 'Credit card', null::numeric, null::text, 70),
      ('documents', 'Emergency contact sheet', null::numeric, null::text, 80),
      ('documents', 'Flight itinerary', null::numeric, null::text, 90),
      ('tech', 'Mobile phone', null::numeric, null::text, 100),
      ('tech', 'Phone charger', 1::numeric, 'charger'::text, 110),
      ('tech', 'Power bank', null::numeric, null::text, 120),
      ('tech', 'Headphones', null::numeric, null::text, 130),
      ('tech', 'Travel adapter', 1::numeric, 'adapter'::text, 140),
      ('tech', 'Laptop', null::numeric, null::text, 150),
      ('tech', 'Laptop charger', 1::numeric, 'charger'::text, 160),
      ('tech', 'USB-C cable', 1::numeric, 'cable'::text, 170),
      ('tech', 'Portable hotspot', null::numeric, null::text, 180),
      ('clothes', 'T-shirts', 5::numeric, 't-shirts'::text, 190),
      ('clothes', 'Socks', 6::numeric, 'pairs'::text, 200),
      ('clothes', 'Underwear', 6::numeric, 'pairs'::text, 210),
      ('clothes', 'Trousers', 2::numeric, 'pairs'::text, 220),
      ('clothes', 'Shorts', 2::numeric, 'pairs'::text, 230),
      ('clothes', 'Hoodie', 1::numeric, 'hoodie'::text, 240),
      ('clothes', 'Lightweight jacket', 1::numeric, 'jacket'::text, 250),
      ('clothes', 'Pajamas', 1::numeric, 'set'::text, 260),
      ('clothes', 'Swimsuit', 1::numeric, 'swimsuit'::text, 270),
      ('clothes', 'Walking shoes', 1::numeric, 'pair'::text, 280),
      ('clothes', 'Sandals', 1::numeric, 'pair'::text, 290),
      ('clothes', 'Sun hat', 1::numeric, 'hat'::text, 300),
      ('toiletries', 'Toothbrush', null::numeric, null::text, 310),
      ('toiletries', 'Toothpaste', 1::numeric, 'tube'::text, 320),
      ('toiletries', 'Deodorant', null::numeric, null::text, 330),
      ('toiletries', 'Sunscreen', 1::numeric, 'bottle'::text, 340),
      ('toiletries', 'Lip balm', null::numeric, null::text, 350),
      ('toiletries', 'Hand sanitizer', 1::numeric, 'bottle'::text, 360),
      ('toiletries', 'Travel-size Shampoo', 1::numeric, 'bottle'::text, 370),
      ('toiletries', 'Travel-size Body wash', 1::numeric, 'bottle'::text, 380),
      ('toiletries', 'Travel-size Face wash', 1::numeric, 'bottle'::text, 390),
      ('toiletries', 'Travel-size Moisturizer', 1::numeric, 'bottle'::text, 400),
      ('toiletries', 'Hairbrush', null::numeric, null::text, 410),
      ('toiletries', 'Razor', null::numeric, null::text, 420),
      ('health', 'Medication', 1::numeric, 'pack'::text, 430),
      ('health', 'Painkillers', 1::numeric, 'pack'::text, 440),
      ('health', 'Plasters', 1::numeric, 'pack'::text, 450),
      ('health', 'First-aid kit', null::numeric, null::text, 460),
      ('health', 'Allergy tablets', 1::numeric, 'pack'::text, 470),
      ('health', 'Rehydration salts', 1::numeric, 'pack'::text, 480),
      ('health', 'Insect repellent', 1::numeric, 'bottle'::text, 490),
      ('health', 'Nasal spray', 1::numeric, 'bottle'::text, 500),
      ('health', 'Eye drops', 1::numeric, 'bottle'::text, 510),
      ('misc', 'Keys', null::numeric, null::text, 520),
      ('misc', 'Water bottle', null::numeric, null::text, 530),
      ('misc', 'Sunglasses', null::numeric, null::text, 540),
      ('misc', 'Tote bag', null::numeric, null::text, 550),
      ('misc', 'Laundry bag', null::numeric, null::text, 560),
      ('misc', 'Packing cubes', 1::numeric, 'set'::text, 570),
      ('misc', 'Travel umbrella', null::numeric, null::text, 580),
      ('misc', 'Neck pillow', null::numeric, null::text, 590),
      ('misc', 'Sleep mask', null::numeric, null::text, 600),
      ('misc', 'Snacks', 3::numeric, 'packs'::text, 610),
      ('misc', 'Daypack', null::numeric, null::text, 620),
      ('misc', 'Reusable shopping bag', null::numeric, null::text, 630)
  )
  select
    categories.name as category_name,
    catalog_items.id as catalog_item_id,
    starter_items.item_name,
    starter_items.quantity,
    starter_items.unit,
    starter_items.sort_order
  from starter_items
  join public.categories
    on categories.scope = 'system'
   and categories.slug = starter_items.category_slug
  join public.catalog_items
    on catalog_items.category_id = categories.id
   and catalog_items.normalized_name = public.normalize_name(starter_items.item_name)
  order by starter_items.sort_order;
$$;

select public.seed_packing_system_defaults();
