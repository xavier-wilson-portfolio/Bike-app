"""Builds the universal restoration courses: one pack per kind of bike (data/packs/restore-<style>).

Any bike can be restored with one of these. The steps are the same core restoration for every motorcycle,
tailored to the kind of bike: what the bodywork is, how power gets to the back wheel, which brakes and
suspension it usually has, and what its finish needs. The rider's own year, make and model come from the
project, so the text uses {bike} and {short}, filled in by the app. {sil} becomes the bike's silhouette.

Numbers that only a factory manual can give (torques, clearances, capacities) are always left as VERIFY.
Run: python3 build/make_universal.py
"""
import json, pathlib, copy

ROOT = pathlib.Path(__file__).resolve().parent.parent
TS = "2026-10-15T00:00:00Z"
VERIFY = "VERIFY IN FACTORY SERVICE MANUAL"
TYPICAL = "Typical interval, not yet checked against the service manual"


def stamp(r):
    r.update({"createdAt": TS, "updatedAt": TS, "updatedBy": "Revora starter project", "archived": False})
    return r


# ====================================================================== the core course (every bike)
LESSONS = {
    "A": dict(title="Get set up", icon="book", cover="tools", short="Identify your bike exactly, check recalls, get the manual, and set up your space and budget.",
              about="Pin down exactly which {bike} you have from the VIN and engine number, check for open recalls, get the service manual, and set up a safe place to work and a budget.",
              why="Parts, specs and recalls all depend on the exact model and year. Ten minutes here saves ordering the wrong parts later.",
              tips=["Photograph the VIN plate and the engine number before anything gets dirty or painted.", "Keep the full VIN out of photos you post online.", "Buy the factory service manual if it exists for your bike. It's the source for every number in this course."],
              shops=["nhtsa", "manuals"]),
    "B": dict(title="Inspect it as it sits", icon="eye", cover="{sil}", short="Photos, fluids, compression and, if it's safe, a start and a short ride.",
              about="Before taking anything apart, record the mileage, photograph everything, check every fluid, test compression, and start it if it's safe to. A short ride tells you even more.",
              why="A bike that runs tells you where the real work is. A compression test tells you whether the engine needs opening up, which is the biggest cost decision in the whole project.",
              tips=["If it has sat for months, don't just crank it. Fresh fuel, fresh oil and a charged battery first.", "Do the compression test before you spend money on anything else.", "Write down every noise, leak and warning light, even small ones."],
              shops=["manuals"]),
    "C": dict(title="Research, budget & order", icon="cart", cover="tools", short="Turn what you found into a parts list, check part numbers on the diagrams, price it and order.",
              about="Use your inspection notes to build the parts and supplies list, look up part numbers on the factory parts diagrams for your year and model, price everything and order.",
              why="Ordering once, with the right part numbers, saves weeks of waiting and return shipping.",
              tips=["Order rebuild kits as sets: gaskets, seals, carb kits.", "Compare the delivered price, not the sticker price.", "Check each part number against your exact year and model. Many bikes changed mid-year."],
              shops=["fiche", "partzilla", "revzilla"]),
    "D": dict(title="Strip it down", icon="layers", cover="{sil}", short="Take off the seat, tank and bodywork, and keep every fastener labeled.",
              about="Remove the seat, fuel tank and bodywork so you can reach the engine, wiring and frame. Bag and label every fastener with where it came from.",
              why="Labeled bags and photos are what make reassembly easy. Most restorations that stall do it at reassembly.",
              tips=["Photograph each area before and after you take it apart.", "One bag per panel or area, labeled.", "Drain the fuel tank before you lift it off."],
              shops=["fiche", "ebay"]),
    "E": dict(title="Clean, frame & rust", icon="spray", cover="tools", short="Clean it, inspect the frame and swingarm, treat rust, and check the wiring.",
              about="With the bike stripped, clean everything so you can see it, inspect the frame and swingarm for cracks and crash damage, deal with rust and look the wiring harness over.",
              why="Dirt hides cracks, leaks and chafed wires. This is the cheapest time to find them.",
              tips=["Cover the intake, exhaust and electrical connectors before washing.", "Look hardest at welds, the steering head and the swingarm pivot.", "Rust on a structural part means inspect first, decide second."],
              shops=["por15", "revzilla"]),
    "F": dict(title="Electrical & charging", icon="bolt", cover="electrical", short="Battery, charging system, grounds, starter and ignition, then every light and switch.",
              about="Test the battery and the charging system, clean the grounds and connectors, check the starter and ignition, then test every light, switch and warning lamp.",
              why="Most electrical trouble is a tired battery, a bad ground or a dirty connector. Working through it in order finds the fault instead of throwing parts at it.",
              tips=["Every electrical test is meaningless with a weak battery. Start there.", "Use the wiring diagram for your exact model and year.", "Disconnect the battery before working on wiring."],
              shops=["ricks", "fiche"]),
    "G": dict(title="Fuel system", icon="fuel", cover="fuel", short="Tank, petcock or pump, lines and filters, then carbs or injection, air filter and sync.",
              about="Clean the tank inside, service the petcock or fuel pump, replace the fuel lines and filters, rebuild the carburetors or check the fuel injection, and finish with the air filter and a sync.",
              why="Old fuel turns to varnish and blocks carb jets and injector screens. Most bikes that have sat won't run right until the fuel system is cleaned out.",
              tips=["No sparks or flames near fuel, ever.", "Work on one carb at a time so parts never get mixed.", "Write down jet sizes and settings before you change anything."],
              shops=["fiche", "caswell", "revzilla"]),
    "H": dict(title="Engine service", icon="engine", cover="engine", short="Oil and filter, plugs, valves, cooling, clutch, and leaks.",
              about="Change the oil and filter, replace the spark plugs, check the valve clearances, service the cooling system, set up the clutch, and fix oil leaks and exhaust leaks.",
              why="These are the jobs that keep the engine healthy for years. Valve clearances in particular get skipped and quietly wear an engine out.",
              tips=["Warm the engine before draining the oil.", "Valve clearances are measured with the engine cold.", "Start spark plugs by hand to avoid cross-threading."],
              shops=["fiche", "revzilla"]),
    "I": dict(title="Final drive", icon="wrench", cover="tools", short="The parts that get power to the back wheel.",
              about="Check and service the parts that drive the rear wheel.",
              why="A worn final drive can fail without warning.",
              tips=["Clean it before you judge it."],
              shops=["revzilla", "denniskirk"]),
    "J": dict(title="Wheels & tires", icon="wheel", cover="wheels", short="Tire age and wear, wheel bearings, rims and spokes, and new tires.",
              about="Check the tires' age, tread and damage, the wheel bearings, and the rims and spokes or cast wheels, then fit and balance new tires if they need it.",
              why="Tires age out even with tread left, and old rubber is hard and slippery. Tires are one of the few parts where cheap is never a good deal.",
              tips=["Read the four-digit date code on each sidewall: week, then year.", "Use the sizes, load and speed ratings your manual or tire placard gives.", "Replace wheel bearings in pairs, with new seals."],
              shops=["revzilla", "denniskirk", "allballs"]),
    "K": dict(title="Brakes", icon="shield", cover="brakes", short="Pads or shoes, discs or drums, calipers, master cylinders, hoses and fresh fluid.",
              about="Inspect the pads or shoes and the discs or drums, rebuild or clean the calipers and master cylinders, check the hoses, and bleed in fresh fluid.",
              why="Brakes on a bike that has sat are almost always sticky, and old fluid absorbs water. This part is safety-critical from start to finish.",
              tips=["Use only the fluid type printed on the reservoir cap.", "Brake fluid strips paint. Cover the tank and bodywork.", "Never let a reservoir run dry while bleeding."],
              shops=["fiche", "revzilla", "denniskirk"]),
    "L": dict(title="Suspension, steering & controls", icon="wrench", cover="suspension", short="Fork oil and seals, steering bearings, shocks and swingarm, cables and controls.",
              about="Service the forks, check and adjust the steering head bearings, inspect the rear shocks and swingarm bearings, lube and adjust the control cables, and set the sag for your weight.",
              why="Tired fork oil and worn bearings make a bike wander, dive and feel vague. Fresh suspension changes how a bike rides more than almost anything else.",
              tips=["Support the bike securely with the front wheel off the ground before checking steering bearings.", "Fork oil type and amount come from the manual.", "Write down any suspension settings before changing them."],
              shops=["allballs", "revzilla"]),
    "M": dict(title="Finish & cosmetics", icon="spray", cover="{sil}", short="Paint, plating and trim.",
              about="Bring the finish back.",
              why="A good finish protects the metal as well as looking right.",
              tips=["Test any product on a hidden spot first."],
              shops=["por15", "ebay"]),
    "N": dict(title="Reassemble, road test & keep it running", icon="check", cover="{sil}", short="Put it back together, check every safety fastener, first start, road test, then the maintenance log.",
              about="Reassemble the bike from your labeled bags and photos, torque-check the safety-critical fasteners, do the first start, take a careful test ride, then set up the Maintenance log so it stays sorted.",
              why="The test ride is where loose bolts, air in the brakes and leaks show up, while they're still cheap to fix.",
              tips=["Start every fastener by hand before you tighten it.", "Have a second person check the safety items.", "Start the first ride slowly in a quiet area."],
              shops=["manuals"]),
}

# (id, title, module, safety, hours, tools, instructions, reason, expected, howto, prereqs)
T = {}
def task(*a):
    T[a[0]] = a

task("A-001", "Identify your bike exactly", "general", "High", 0.5, "Flashlight, phone camera",
     "Find the VIN and the engine number, confirm the year and model from them, and note anything that isn't stock.",
     "The right manual, parts and recalls depend on the exact model and year.", "VIN, engine number, year and model recorded in Settings.",
     ["Find the VIN, usually on the steering head or a frame plate.", "Find the engine number, stamped on the crankcase.", "Photograph both and enter them in Settings (keep the VIN out of public photos).", "Note anything that looks non-original: exhaust, seat, lights, bars."], [])
task("A-002", "Check for open recalls", "general", "Critical", 0.5, "Phone or computer",
     "Run the VIN through the NHTSA recall lookup (or your country's equivalent) and confirm with a dealer which recalls have been done.",
     "Recall repairs are free at a dealer and often cover the exact problem you'd otherwise pay to fix.", "Every open recall noted, or none found.",
     ["Go to nhtsa.gov/recalls and enter the 17-digit VIN. Bikes from before 1981 have shorter VINs and usually no online recall record.", "Log any open recall in Problems & decisions.", "Call a dealer for your make with the VIN to book any open recall work."], ["A-001"])
task("A-003", "Get the service manual", "general", "High", 0.5, "",
     "Get the factory service manual for your exact model and year, plus the owner's manual and a wiring diagram.",
     "Torque values, clearances, capacities and procedures in this course all come from the manual.", "Manual on hand and listed under Reference sources.",
     ["Search for the factory service manual for your model code and year.", "If there isn't one, a Haynes or Clymer manual is the next best thing.", "Add it to Reference sources so the whole team knows where it is."], ["A-001"])
task("A-004", "Set up the workspace", "general", "Medium", 1.5, "Stand or lift, shelves, bins, labels",
     "Clear a space with good light, a stand or lift, bins for fasteners and a safe spot for fluids.",
     "A tidy space means fewer lost parts and fewer accidents.", "Bike secure on a stand; labeled bins and drain pans ready.",
     ["Put the bike on a stand or lift on a level floor.", "Set up labeled bins or bags for fasteners.", "Keep a drain pan, rags and a fire extinguisher within reach."], [])
task("A-005", "Set the budget", "general", "Low", 0.5, "",
     "Set a budget in Settings with a cushion for surprises.",
     "Knowing the limit helps you decide between repair and replace as you go.", "Budget and safety cushion set in Settings.",
     ["List the costs you already expect: tires, battery, brake parts, fluids, a carb or service kit.", "Add a cushion of 15 to 25 percent for surprises.", "Enter both in Settings."], [])

task("B-001", "Record the odometer and photograph everything", "general", "Low", 0.5, "Phone camera",
     "Record the odometer, then photograph the bike from every side and close up on damage, wiring routes and anything you'll need to put back.",
     "Before photos are your best reassembly guide and record the condition you started with.", "Odometer logged; before photos uploaded.",
     ["Log the odometer in the Maintenance log.", "Photograph both sides, front, back and from above.", "Close-ups of wiring routes, cable routes, damage, leaks and modifications."], [])
task("B-002", "Check every fluid and look for leaks", "general", "High", 1.0, "Flashlight, rags",
     "Check the engine oil, coolant (if liquid-cooled), brake fluid and any final-drive oil for level and condition, and look for leaks.",
     "Low, milky or dark fluids and wet spots point straight at the jobs you need to do.", "Each fluid's level and condition recorded; leaks logged as problems.",
     ["Check oil on the dipstick or sight glass the way the manual says (upright or on the side stand).", "Milky oil can mean water or coolant in it. Log it.", "Check brake fluid color: dark means old.", "Look under the engine, at the fork seals, the calipers and any final-drive housing for leaks."], ["B-001"])
task("B-003", "Test compression", "engine", "High", 1.0, "Compression gauge, spark plug socket",
     "Do a compression test on every cylinder and compare the readings with the manual and with each other.",
     "Compression tells you if the rings and valves are healthy, which decides whether the engine needs opening up.", "Readings for every cylinder recorded in Measurements.",
     ["Warm the engine if it runs; if not, test it cold and note that.", "Remove all spark plugs and ground the plug leads or disable the ignition.", "Hold the throttle wide open and crank until the gauge stops rising.", "Record each cylinder. A big difference between cylinders matters more than the exact number."], ["B-002"])
task("B-004", "Start it and listen", "engine", "High", 0.5, "Fresh fuel, charged battery",
     "If the oil is good and the engine turns over freely, start it with fresh fuel and listen for knocks, rattles and rough running as it warms up.",
     "Noises and warning lights at start-up are early warnings of bigger problems.", "Start-up behavior, noises and warning lights recorded, or why it wouldn't start.",
     ["Never force an engine that won't turn over. Log it instead.", "Use fresh fuel and a charged battery.", "Listen for knocking, ticking and rattles, and watch for smoke.", "Watch the temperature and the warning lights."], ["B-003"])
task("B-005", "Short test ride, if it's safe", "chassis", "Critical", 0.5, "Helmet and gear",
     "If the brakes work, the tires hold air and the steering is free, ride slowly around the block and note how it brakes, shifts and handles.",
     "A ride shows problems you can't find on the stand.", "Ride notes written, or ride skipped with the reason recorded.",
     ["Only ride if both brakes work, the tires hold air and the steering is free.", "Test the brakes at walking speed first.", "Note clutch feel, shifting, wobbles and any warning lights."], ["B-004"])
task("B-006", "Write the job list", "general", "Medium", 0.5, "",
     "Turn the inspection notes into a list of jobs, marking anything safety-related, and decide which parts of the course you'll do in full.",
     "A clear list keeps the project focused and drives the parts order.", "Problems logged with severity; job list agreed.",
     ["Add a problem for each issue you found.", "Mark brakes, tires, steering and fuel leaks as high severity.", "Mark any course steps that don't apply to your bike as Cancelled."], ["B-005"])

task("C-001", "Look up part numbers on the diagrams", "general", "Medium", 1.0, "",
     "Use the factory parts diagrams for your year and model to find the part number for everything on the job list.",
     "The right part number is the only reliable way to order the right part.", "Part numbers entered on each part in Parts.",
     ["Open the parts diagrams site and pick your make, year and model.", "Find the reference number on the drawing, then the part number in the list.", "Type the part number into that part's record here."], ["A-003", "B-006"])
task("C-002", "Price it and check the budget", "general", "Low", 0.5, "",
     "Price each part from at least two shops including shipping and compare the total with the budget.",
     "Delivered prices vary more than you'd expect.", "Shopping list priced; budget forecast checked.",
     ["Add each part to the Shopping list.", "Add two quotes where you can, with shipping.", "Check the Money page forecast against the budget."], ["C-001"])
task("C-003", "Order the parts", "general", "Low", 0.5, "",
     "Order the parts and supplies, recording order dates and tracking.",
     "Ordering everything at once avoids stopping halfway through a job.", "Every item ordered and tracked.",
     ["Order kits and service parts together.", "Record the order date and tracking on each item.", "Check each part against its part number when it arrives."], ["C-002"])

task("D-001", "Remove the seat and side covers", "finish", "Low", 0.5, "Ignition key, hex keys, screwdrivers",
     "Remove the seat and side covers, bagging and labeling each fastener.",
     "Access to the battery, fuses and wiring starts here.", "Seat and side covers off; fasteners bagged and labeled.",
     ["Unlock or unbolt the seat and lift it off.", "Remove the side covers gently; many have rubber grommets or clips.", "Bag the fasteners and write where they came from."], ["A-004"])
task("D-002", "Disconnect and remove the battery", "electrical", "High", 0.2, "Screwdriver or hex key",
     "Disconnect the battery, negative first, and remove it for testing and charging.",
     "Working with the battery connected risks shorts and damaged electronics.", "Battery out and on a smart charger.",
     ["Remove the negative cable first, then the positive.", "Lift the battery out and keep it upright.", "Put it on a smart charger or maintainer."], ["D-001"])
task("D-003", "Drain and remove the fuel tank", "fuel", "High", 1.0, "Fuel can, drain hose, rags",
     "Drain the fuel into an approved can, disconnect the lines and any wiring, and remove the tank.",
     "The tank has to come off to reach the top of the engine, and a full tank is heavy and dangerous to handle.", "Tank off, drained and stored safely away from sparks.",
     ["Work outside or with plenty of airflow, no flames or sparks nearby.", "Drain into an approved fuel can.", "Label and disconnect the fuel lines, vent hoses and any pump or gauge wiring.", "Store the tank on a soft surface away from heat."], ["D-002"])

task("E-001", "Wash and degrease", "finish", "Low", 2.0, "Bucket, soft brushes, degreaser",
     "Clean the bike so you can see the frame, engine and wiring, protecting electrical parts and intakes.",
     "You can't inspect what you can't see.", "Bike clean; no water in connectors or intakes.",
     ["Cover the intake, exhaust outlets and exposed connectors.", "Use a degreaser safe for paint, plastic and aluminum.", "Rinse gently, then dry with air or a towel."], ["D-003"])
task("E-002", "Inspect the frame and swingarm", "chassis", "Critical", 1.0, "Flashlight",
     "Inspect the frame, subframe, mounts and swingarm for cracks, bends, rust and crash damage.",
     "A cracked or bent frame makes the bike unsafe, and it's far better to know now.", "Frame and swingarm checked; any damage logged.",
     ["Look closely at welds, engine mounts, the steering head and the swingarm pivot.", "Check the subframe and footpeg mounts for bends.", "Scrapes on bar ends, levers and pegs suggest the bike has been down. Look harder there."], ["E-001"])
task("E-003", "Treat rust and protect bare metal", "finish", "Medium", 2.0, "Wire brushes, rust remover, primer",
     "Remove surface rust, treat what's left, and protect bare metal so it doesn't come back.",
     "Rust spreads under paint and weakens thin parts.", "Rust treated and bare metal protected; deep rust on structural parts logged.",
     ["Wire brush or use rust remover on light rust.", "Never wire-wheel bearing seats, gasket faces or threads.", "Prime bare steel the same day so it doesn't flash rust.", "Log any deep pitting on frame, swingarm or brackets as a problem."], ["E-002"])
task("E-004", "Inspect the wiring harness and connectors", "electrical", "High", 1.0, "Flashlight, contact cleaner",
     "Look over the harness for rubbed insulation, melted spots, old repairs and green corrosion in the connectors.",
     "Chafed wires and corroded connectors cause intermittent faults that are hard to find later.", "Harness checked; damage logged.",
     ["Follow the harness from the headlight back to the tail.", "Look closely where it passes the steering head and frame edges.", "Open the main connectors and look for corrosion or melted plastic.", "Note any taped-up or non-original repairs."], ["E-001"])

task("F-001", "Test and charge the battery", "electrical", "Medium", 0.5, "Multimeter, battery charger",
     "Fully charge the battery and test it under load, or replace it if it's old or fails.",
     "A weak battery makes every other electrical test meaningless.", "Battery passes, or a new one is fitted.",
     ["Charge it fully with a smart charger.", "Let it rest, then measure the voltage.", "Load-test it or have a shop test it. Replace it if it fails or is more than a few years old."], ["D-002"])
task("F-002", "Test the charging system", "electrical", "High", 1.0, "Multimeter",
     "With a good battery fitted, measure charging voltage at the battery and test the stator or alternator and the regulator using the manual's procedure.",
     "This confirms the bike can keep its own battery charged.", "Readings recorded and compared with the manual's figures.",
     ["Refit the charged battery.", "Measure battery voltage with the engine off, then at the engine speed the manual gives.", "Follow the manual's stator and regulator tests.", "Look at the stator-to-regulator connector for brown, melted or loose pins."], ["F-001"])
task("F-003", "Clean the grounds, fuses and connectors", "electrical", "High", 1.0, "Contact cleaner, fine sandpaper, dielectric grease",
     "Clean and tighten the main ground points, check every fuse and fuse holder, and clean the main connectors.",
     "Bad grounds and corroded fuse holders cause most electrical faults on older bikes.", "Grounds clean and tight; fuses correct rating; connectors clean.",
     ["Find the battery ground, the frame ground and the engine ground.", "Clean each to bare metal and refit tight.", "Check each fuse's rating against the manual and look for corrosion in the holders.", "Clean connectors with contact cleaner and a light film of dielectric grease."], ["F-001", "E-004"])
task("F-004", "Check the starter and ignition", "electrical", "High", 1.0, "Multimeter, spark tester",
     "Check that the starter spins the engine strongly, and that every cylinder gets a good spark. On older bikes, check the points and condenser.",
     "Weak cranking and weak spark are the usual reasons a restored bike won't start.", "Starter and spark checked on every cylinder.",
     ["Crank it and listen: a slow or clicking starter points at the battery, cables, relay or starter.", "Check for spark on each cylinder with a spark tester.", "On points ignition, check the points gap and timing as the manual describes.", "Check plug leads and caps for cracks."], ["F-003"])
task("F-005", "Check lights, switches, horn and warning lamps", "electrical", "Critical", 1.0, "Multimeter",
     "Test every light, the horn, every switch and every warning lamp, and confirm the brake light works from both the front and rear brakes.",
     "Riders need to see and be seen. This is a legal requirement as well as a safety one.", "Every light and switch works; brake light works from lever and pedal.",
     ["Test headlight high and low, turn signals and tail light.", "Test the brake light from the front lever and the rear pedal.", "Check the horn, kill switch, neutral light and side-stand switch if fitted.", "Check the warning lamps come on with the key."], ["F-003"])

task("G-001", "Find out which fuel system it has", "fuel", "Low", 0.2, "",
     "Check whether the bike has carburetors or fuel injection, and how many, and mark the steps below that don't apply as Cancelled.",
     "The fuel steps differ completely between carbs and injection.", "Fuel system type noted; steps that don't apply cancelled.",
     ["Carburetors have float bowls at the bottom and a choke lever or knob.", "Fuel injection has throttle bodies with wiring, a fuel pump and usually an FI warning light.", "Write it on the project in Settings under notes.", "Cancel the carb steps on an injected bike, or the injection step on a carbureted one."], ["D-003"])
task("G-002", "Clean the tank inside and check for rust", "fuel", "High", 2.0, "Flashlight, tank rust remover",
     "Look inside the tank for rust, scale and old fuel varnish, clean it out, and seal it if there are pinholes.",
     "Rust and varnish from the tank block filters, carbs and injectors again right after you clean them.", "Tank clean and dry inside; sealed if needed.",
     ["Look inside with a flashlight for rust, scale and varnish.", "Use a tank rust remover following its instructions.", "Rinse and dry it right away so flash rust can't form.", "Only use a tank liner rated for ethanol fuel, and let it cure fully."], ["D-003"])
task("G-003", "Service the petcock or fuel pump, lines and filters", "fuel", "High", 1.0, "Screwdrivers, new fuel line, clamps",
     "Rebuild or replace the petcock, check the fuel pump if it has one, replace the fuel lines and filters, and check the tank vent.",
     "Old fuel lines crack and leak, and a fuel leak is a fire risk.", "New lines and filters; petcock or pump working; no leaks.",
     ["Rebuild or replace the petcock seals on gravity-fed bikes.", "On bikes with a pump, check it runs when the key is turned on and replace the filter.", "Replace all rubber fuel lines with ethanol-rated hose and new clamps.", "Make sure the tank vent isn't blocked."], ["G-002"])
task("G-004", "Rebuild the carburetors", "fuel", "High", 6.0, "Carb rebuild kits, carb cleaner, small screwdrivers",
     "Remove the carburetors, rebuild them one at a time with new gaskets, O-rings and needle valves, clean every passage, and set the float height.",
     "Old fuel varnishes the jets and passages, and old rubber parts leak. Most bikes that have sat need this to run right.", "Carbs clean and rebuilt; float heights set to the manual's figure; jet sizes recorded.",
     ["Skip this step on fuel-injected bikes (mark it Cancelled).", "Photograph each carb and record jet sizes, needle clip position and screw settings before you start.", "Work on one carb at a time so no parts get mixed.", "Clean every jet and passage, fit the kit's new parts, and set float height to the manual."], ["G-001", "G-003"])
task("G-005", "Check the fuel injection", "fuel", "Medium", 1.0, "Throttle body cleaner, rags",
     "Read any fault codes, clean the throttle plates, check the injector wiring and fuel pressure as the manual describes.",
     "Sticky throttle plates and fault codes cause rough running that cleaning and a reset often fix.", "No fault codes; throttle plates clean; idle steady.",
     ["Skip this step on carbureted bikes (mark it Cancelled).", "Read fault codes the way the manual shows before replacing anything.", "Clean the throttle plates with throttle body cleaner on a rag, never forcing them.", "Check the injector and sensor connectors are clean and tight."], ["G-001", "G-003"])
task("G-006", "Air filter and intake boots", "fuel", "Medium", 0.5, "Screwdrivers",
     "Replace or clean the air filter and check the intake boots between the carbs or throttle bodies and the engine for cracks.",
     "A cracked intake boot lets in air and makes the engine run lean and hot.", "New or clean filter; intake boots sealed and crack-free.",
     ["Fit a new filter of the right type, or clean and re-oil a foam or cotton one.", "Flex each intake boot and look for cracks.", "Check the airbox is sealed and the drain is clear."], ["G-001"])
task("G-007", "Synchronize the carbs or throttle bodies", "fuel", "Medium", 1.5, "Vacuum sync gauges",
     "On multi-cylinder bikes, synchronize the carbs or throttle bodies with vacuum gauges, then set the idle.",
     "Out-of-sync carbs or throttle bodies make the bike lumpy at low speed and harder to ride smoothly.", "Every cylinder balanced to the manual's figure; idle set.",
     ["Skip this on single-cylinder bikes.", "Warm the engine fully.", "Connect the gauges to the vacuum ports the manual shows.", "Adjust until the readings match, then set the idle speed."], ["G-004", "G-005", "G-006", "H-001"])

task("H-001", "Change the oil and filter", "engine", "High", 1.0, "Drain pan, filter wrench, torque wrench",
     "Drain the warm oil, replace the filter and drain bolt washer, and refill with the type and amount the manual gives.",
     "Fresh oil is the cheapest engine protection there is, and old oil on a bike that sat may be full of water.", "New oil and filter; level correct; no leaks.",
     ["Warm the engine, then shut it off.", "Remove the drain bolt and let it drain fully.", "Fit a new filter and drain washer, torqued to the manual's values.", "Refill with the specified oil and check the level the way the manual says."], ["B-006"])
task("H-002", "Replace the spark plugs", "engine", "Medium", 0.5, "Plug socket, gap gauge, torque wrench",
     "Replace the spark plugs with the type the manual lists, gapped to spec.",
     "New plugs are cheap and rule out one cause of poor running.", "New plugs fitted, gapped and torqued.",
     ["Let the engine cool.", "Blow dirt out of each plug well before removing the plug.", "Read the old plugs' color: it tells you how each cylinder was running.", "Start new plugs by hand, then torque to spec."], ["D-003"])
task("H-003", "Check and adjust the valve clearances", "engine", "High", 4.0, "Feeler gauges, manual",
     "With the engine cold, measure every valve clearance and adjust any that are out of spec using the manual's method.",
     "Tight valves burn, loose valves are noisy and wear the cams. It's one of the most skipped jobs.", "Every clearance recorded in Measurements and within spec.",
     ["Some engines have hydraulic lifters that need no adjustment. Check the manual and cancel this step if so.", "With the engine cold, set each cylinder as the manual describes.", "Measure every valve and record it.", "Adjust any out of spec using screws, shims or buckets as your engine uses."], ["D-003"])
task("H-004", "Service the cooling system", "engine", "High", 1.5, "Drain pan, funnel",
     "Liquid-cooled: replace the coolant, check the radiator, hoses, cap and fan. Air-cooled: clean the fins and check any oil cooler and lines.",
     "Overheating kills engines. Old coolant corrodes from the inside and old hoses split under pressure.", "Coolant fresh and bled, or fins and oil cooler clean; fan works.",
     ["Only open a radiator cap on a cold engine.", "Drain and refill with the coolant type the manual specifies, then bleed out the air.", "Squeeze each hose: replace any that are hard, soft or cracked.", "On air-cooled bikes, clean between the fins and check oil cooler lines for leaks."], ["D-003"])
task("H-005", "Set up the clutch", "engine", "Medium", 0.5, "",
     "Lube and adjust the clutch cable, or bleed a hydraulic clutch, and check the clutch frees and doesn't slip.",
     "Too little play makes the clutch slip; too much makes shifting hard.", "Clutch play within the manual's range; clutch frees fully.",
     ["Cable clutch: lube the cable and set the free play at the lever.", "Hydraulic clutch: replace the fluid and bleed it like a brake.", "Check the bike doesn't creep in gear with the clutch pulled in."], ["H-001"])
task("H-006", "Fix oil leaks and check the exhaust", "engine", "Medium", 2.0, "Gaskets, seals, wrenches",
     "Find and fix oil leaks at covers and seals, and check the exhaust for leaks, rust-through and loose mounts.",
     "Oil on the tires and brakes is dangerous, and exhaust leaks make the engine run badly.", "No oil leaks; exhaust sealed and mounts tight.",
     ["Clean the engine, run it, and look for fresh oil to find the real source.", "Replace cover gaskets and seals with new ones.", "Check the exhaust gaskets at the head and look for rust-through or cracks.", "Tighten the exhaust mounts to the manual's values."], ["H-001"])

# final drive: replaced per style below (chain by default)
DRIVES = {
    "chain": dict(tile=("Chain drive", "Chain, sprockets and alignment"),
        lesson=dict(title="Chain & sprockets", short="Chain wear and slack, sprockets, alignment and the rear cush drive.",
                    about="Measure the chain for wear, check the sprockets, set the slack and wheel alignment, and check the rubber cush drive in the rear hub.",
                    why="A worn chain can jump the sprockets or break. A chain and sprockets are a set and wear out together.",
                    tips=["Replace the chain and both sprockets together.", "Set slack with the bike the way the manual says (stand or rider on).", "Check the alignment marks on both sides of the swingarm match."]),
        tasks=[("I-001", "Measure the chain and sprockets", "chassis", "High", 0.5, "Chain wear gauge or ruler",
                "Clean the chain, measure its wear over the length the manual gives, check for tight spots, and look for hooked sprocket teeth.",
                "A worn chain can jump or break.", "Chain and sprockets pass, or a kit is ordered.",
                ["Clean the chain so you can see the rollers and O-rings.", "Measure wear over the length the manual gives, or use a chain gauge.", "Rotate the wheel and feel for tight spots.", "Look for hooked or pointed sprocket teeth."], ["E-001"]),
               ("I-002", "Replace the chain and sprockets if worn", "chassis", "Critical", 2.0, "Chain breaker and riveter, torque wrench",
                "Fit a new chain and both sprockets as a set, with the chain joint riveted or clipped exactly as the maker says.",
                "A new chain on old sprockets wears out fast.", "New chain and sprockets fitted; joint secured correctly.",
                ["Mark this Cancelled if the chain and sprockets passed.", "Fit the sprockets and torque their nuts or bolts to spec.", "Use a rivet link on high-power bikes; follow the chain maker's instructions.", "Check the master link before every ride for the first week."], ["I-001", "C-003"]),
               ("I-003", "Set slack and alignment, and check the cush drive", "chassis", "High", 0.5, "Ruler, torque wrench",
                "Set the chain slack to the manual's figure, align the rear wheel, torque the axle, and check the cush drive rubbers.",
                "Too tight wears bearings and the chain; too loose and it can come off. Misalignment wears everything.", "Slack and alignment set; axle torqued; cush drive tight.",
                ["Set slack at the tightest point of the chain.", "Match the alignment marks on both sides.", "Torque the axle nut and fit a new cotter pin if it uses one.", "With the wheel out, check the cush rubbers for cracks and play."], ["I-001"])],
        sched=[("Chain clean and lube", "Drivetrain", 500, 0), ("Chain slack and wear check", "Drivetrain", 1000, 0)],
        parts=[("Final drive", "chassis", "Drive chain"), ("Final drive", "chassis", "Front and rear sprockets"), ("Final drive", "chassis", "Rear cush drive")],
        insp=[("Drive chain", "Chain wear over the measured length", "mm", "Ruler or chain gauge", True), ("Drive chain", "Chain slack", "mm", "Ruler", True)],
        check=("Chain", "Chain and sprockets in limits, slack set", "Critical", "I-003", "Wear and slack within the manual's figures; master link secure."),
        tools=[("Chain wear gauge", "Measuring tool", "Measuring chain wear."), ("Chain breaker and riveter", "Hand tool", "Fitting a new chain.")],
        purchase=("Chain lube and cleaner", "Drive chain", "I-001")),
    "belt": dict(tile=("Belt drive", "Belt tension, pulleys, primary"),
        lesson=dict(title="Belt drive & primary", short="Belt condition and tension, pulleys, and the primary drive.",
                    about="Inspect the drive belt and pulleys, set the belt tension with a gauge, and service the primary drive if your bike has a separate primary case.",
                    why="A belt can look fine and still be close to failing. Stones between belt and pulley are a common killer, and a broken belt leaves you stranded.",
                    tips=["Never twist, kink or pry a drive belt. It damages the cords inside.", "Set tension with a belt tension gauge the way the manual says.", "Many cruisers with belts also have a primary chaincase with its own oil."]),
        tasks=[("I-001", "Inspect the drive belt and pulleys", "chassis", "High", 0.5, "Flashlight",
                "Check the belt for cracks, missing or worn teeth, cuts and stone damage, and the pulleys for worn or hooked teeth.",
                "A damaged belt can snap with little warning.", "Belt and pulleys pass, or replacements ordered.",
                ["Rotate the wheel and look at the whole belt, both faces and both edges.", "Replace it if a tooth is missing or cords show.", "Look for stones caught in the pulley teeth.", "Check the pulley teeth for hooks or sharp edges."], ["E-001"]),
               ("I-002", "Set the belt tension and alignment", "chassis", "High", 0.5, "Belt tension gauge",
                "Measure the belt deflection with a tension gauge at the point and force the manual gives, set it, and check the wheel alignment.",
                "Too tight wears bearings; too loose lets the belt jump teeth.", "Tension and alignment within the manual's figures; axle torqued.",
                ["Set the tension with the bike as the manual says (on the stand or on its wheels).", "Measure deflection with a belt tension gauge at the stated force.", "Adjust both sides evenly so the wheel stays aligned.", "Torque the axle nut and fit a new cotter pin if it uses one."], ["I-001"]),
               ("I-003", "Service the primary drive", "engine", "Medium", 1.0, "Drain pan, gasket or O-ring",
                "If the bike has a separate primary case, drain and refill its oil, and check the primary chain or belt adjuster.",
                "The primary drive runs in its own oil on many cruisers and is easy to forget.", "Primary oil fresh; primary chain adjusted, or step cancelled.",
                ["Cancel this if the primary drive shares the engine oil.", "Drain the primary case and refill with the type and amount the manual gives.", "Check and set the primary chain adjuster.", "Fit a new gasket or O-ring on the cover."], ["H-001"])],
        sched=[("Drive belt inspect and tension", "Drivetrain", 5000, 12), ("Primary chaincase oil", "Drivetrain", 10000, 12)],
        parts=[("Final drive", "chassis", "Drive belt"), ("Final drive", "chassis", "Front and rear pulleys"), ("Final drive", "engine", "Primary drive and chaincase")],
        insp=[("Drive belt", "Belt deflection at the stated force", "mm", "Belt tension gauge", True), ("Drive belt", "Belt condition, teeth and edges", "", "Visual", True)],
        check=("Belt", "Belt in good condition and tension set", "Critical", "I-002", "No missing teeth or exposed cords; tension within the manual's figure."),
        tools=[("Belt tension gauge", "Measuring tool", "Setting drive belt tension.")],
        purchase=("Primary chaincase oil (type from the manual)", "Primary drive and chaincase", "I-003")),
    "shaft": dict(tile=("Shaft drive", "Gear oil, splines and leaks"),
        lesson=dict(title="Shaft drive", short="Final drive oil, splines, U-joint and leaks.",
                    about="Change the final drive oil, check the rear drive for play and leaks, and clean and grease the drive splines.",
                    why="Shaft drives last a long time when the oil is changed and the splines are greased. Dry splines wear out quickly and are expensive to replace.",
                    tips=["Use the exact gear oil the manual gives for the final drive.", "Grease the splines with the moly grease the manual specifies.", "Clunks when getting on and off the throttle can be a worn U-joint or splines."]),
        tasks=[("I-001", "Change the final drive oil", "chassis", "High", 0.5, "Drain pan, torque wrench",
                "Drain the final drive gear oil, check it for metal, and refill with the type and amount the manual gives.",
                "Old gear oil wears the gears and bearings in the rear drive.", "Fresh oil to the correct level; no leaks; no metal in the old oil.",
                ["Warm it with a short ride if you can.", "Drain and look at the oil and the drain plug magnet for metal flakes.", "Refill with the specified gear oil to the level the manual gives.", "Fit new sealing washers and torque the plugs."], ["E-001"]),
               ("I-002", "Check the rear drive for play and leaks", "chassis", "High", 0.5, "Flashlight",
                "With the rear wheel off the ground, check for play in the drive, rough spots, and oil leaks at the seals.",
                "Play or leaks are early signs of bearing or seal failure in the rear drive.", "No unusual play, roughness or leaks.",
                ["Rock the wheel back and forth and feel for excessive free play.", "Spin it and listen for grinding.", "Look for oil at the pinion seal, the wheel-side seal and the boot."], ["I-001"]),
               ("I-003", "Clean and grease the drive splines", "chassis", "High", 2.0, "Moly grease, torque wrench",
                "Remove the rear wheel and final drive as the manual describes, clean and inspect the splines, and grease them.",
                "Dry splines wear fast and are one of the most expensive shaft-drive repairs.", "Splines clean, undamaged and greased; everything torqued back.",
                ["Follow the manual's order for removing the wheel and rear drive.", "Clean the splines and look for worn, sharp or stepped teeth.", "Grease with the specified moly grease.", "Reassemble and torque every fastener to spec."], ["I-002"])],
        sched=[("Final drive oil change", "Drivetrain", 12000, 24), ("Drive spline grease", "Drivetrain", 24000, 0)],
        parts=[("Final drive", "chassis", "Final drive unit and gear oil"), ("Final drive", "chassis", "Drive shaft, U-joint and splines")],
        insp=[("Final drive unit and gear oil", "Final drive free play and leaks", "", "By hand", True), ("Drive shaft, U-joint and splines", "Spline condition", "", "Visual", True)],
        check=("Final drive", "Final drive full, no leaks or play", "Critical", "I-002", "Oil at the right level; seals dry; no unusual play."),
        tools=[("Moly grease", "Supplies", "Greasing the drive splines.")],
        purchase=("Final drive gear oil (type from the manual)", "Final drive unit and gear oil", "I-001")),
    "cvt": dict(tile=("CVT transmission", "Belt, rollers and clutch"),
        lesson=dict(title="CVT, belt & final gear", short="Drive belt, variator rollers, clutch, and the final gear oil.",
                    about="Open the CVT case, check the drive belt, the variator rollers and the clutch, clean out the belt dust, and change the final gear oil.",
                    why="The CVT belt and rollers are wear items. A worn belt makes the scooter slow and can snap, and flat-spotted rollers make it pull badly.",
                    tips=["Clean all the belt dust out of the CVT case.", "Never get grease on the belt or the pulley faces.", "Replace the belt and rollers together if they're worn."]),
        tasks=[("I-001", "Check the CVT belt and variator", "engine", "High", 1.5, "Variator holder tool, calipers",
                "Remove the CVT cover, measure the belt width, inspect it for cracks and glazing, and check the variator rollers for flat spots.",
                "A worn belt slips and can snap; flat rollers make the scooter pull weakly.", "Belt width within the manual's limit; rollers round; case clean.",
                ["Remove the CVT cover and blow out the belt dust (wear a mask).", "Measure belt width and compare with the manual's service limit.", "Look for cracks, fraying and glazed sides.", "Check each roller for flat spots and the ramp plate for wear."], ["E-001"]),
               ("I-002", "Check the clutch and bell", "engine", "Medium", 1.0, "Clutch holder tool",
                "Inspect the clutch shoes for wear and the clutch bell for scoring, and check the torque spring.",
                "Worn shoes make the scooter judder or slip on take-off.", "Shoe thickness and bell within limits.",
                ["Hold the clutch with the right tool and remove the nut.", "Measure the shoe lining thickness.", "Look inside the bell for deep scoring or a blue heat color.", "Clean everything with brake cleaner, no grease on friction surfaces."], ["I-001"]),
               ("I-003", "Change the final gear oil", "engine", "Medium", 0.5, "Drain pan",
                "Drain and refill the final gear oil with the type and amount the manual gives.",
                "The final gear oil is small in volume and easy to forget.", "Fresh oil to the correct amount; plugs sealed.",
                ["Find the drain and fill plugs on the gear case.", "Drain the old oil and look for metal.", "Refill with the exact amount the manual gives.", "Fit new washers on the plugs."], ["H-001"])],
        sched=[("CVT belt inspect", "Drivetrain", 6000, 12), ("CVT belt and rollers replace", "Drivetrain", 12000, 0), ("Final gear oil", "Drivetrain", 6000, 12)],
        parts=[("Final drive", "engine", "CVT drive belt"), ("Final drive", "engine", "Variator and rollers"), ("Final drive", "engine", "Clutch and clutch bell"), ("Final drive", "engine", "Final gear case and oil")],
        insp=[("CVT drive belt", "Belt width", "mm", "Calipers", True), ("Clutch and clutch bell", "Clutch shoe lining thickness", "mm", "Calipers", False)],
        check=("CVT", "CVT belt and clutch in limits", "Critical", "I-002", "Belt width within limit; clutch engages smoothly without judder."),
        tools=[("Variator and clutch holder tools", "Hand tool", "Holding the variator and clutch to remove the nuts.")],
        purchase=("Final gear oil (type from the manual)", "Final gear case and oil", "I-003")),
}

task("J-001", "Check tire age, tread and damage", "chassis", "Critical", 0.5, "Tread gauge, tire gauge",
     "Read the date code on both tires, measure the tread, and look for cracks, cuts, plugs and flat spots.",
     "Tires age out even with tread left. Old rubber is hard and slippery.", "Both tires pass, or replacements ordered.",
     ["Find the four-digit date code on each sidewall (week, then year).", "Measure the tread in the center and the edges.", "Look for cracks, cuts, plugs and squared-off wear.", "Most riders replace tires older than about five years regardless of tread."], [])
task("J-002", "Check the wheel bearings", "chassis", "High", 0.5, "Stand",
     "With each wheel off the ground, check for play and rough rotation, and replace bearings and seals if needed.",
     "Worn bearings make the bike wander and can seize.", "No play; smooth rotation; seals intact.",
     ["Lift the wheel off the ground.", "Rock it side to side at the top and bottom; feel for play.", "Spin it and listen for grinding.", "Replace bearings in pairs with new seals."], ["A-004"])
task("J-003", "Inspect the rims and wheels", "chassis", "Critical", 0.5, "Spoke wrench, dial indicator",
     "Check spoked wheels for loose or rusted spokes and runout, and cast wheels for cracks and bends.",
     "A cracked cast wheel or a wheel with loose spokes can fail on the road.", "Wheels true and sound, or sent to a wheel builder.",
     ["Spoked: tap each spoke with a wrench; dull ones are loose.", "Spin the wheel and watch the rim edge for wobble.", "Cast: look closely at the spokes and rim edge for cracks, especially near the hub.", "Any crack in a cast wheel means replace it."], ["J-002"])
task("J-004", "Fit and balance new tires", "chassis", "Critical", 1.5, "Tire irons, balancer, or a shop",
     "Fit new tires in the size, load and speed rating the manual or tire placard gives, with new valves or tubes, and balance the wheels.",
     "The right tires correctly fitted and balanced are a basic safety item.", "Correct tires fitted, beads seated, balanced, pressures set.",
     ["Mark this Cancelled if the tires passed.", "Check the rotation arrow on each tire.", "Fit new valve stems on tubeless wheels or new tubes and rim tape on tubed wheels.", "Balance the wheels and set the pressures from the manual."], ["J-001", "J-003", "C-003"])

task("K-001", "Inspect the pads, shoes, discs and drums", "chassis", "Critical", 0.5, "Flashlight, micrometer",
     "Check pad or shoe thickness and disc or drum condition on both brakes against the manual's limits.",
     "Worn pads and thin discs are a straight safety issue.", "Pads or shoes and discs or drums within limits, or replacements ordered.",
     ["Look at the pad wear lines or measure the friction material.", "Measure disc thickness and compare with the minimum stamped on the disc.", "Drum brakes: check the wear indicator and the inside of the drum.", "Spin the wheel and watch for a warped disc."], [])
task("K-002", "Rebuild or clean the calipers", "chassis", "Critical", 3.0, "Brake cleaner, caliper rebuild kits, torque wrench",
     "Strip and clean the calipers, check the pistons for pitting, replace the seals if they're sticky, and fit new pads.",
     "Calipers on a bike that has sat usually stick. Sticky pistons drag and brake unevenly.", "Pistons move smoothly; new seals and pads fitted; bolts torqued.",
     ["Remove the caliper as the manual describes.", "Push the pistons out carefully and look for pitting or rust.", "Fit new seals from a kit and lube with clean brake fluid.", "Fit the pads and pins, torque the caliper bolts, and pump the lever before moving the bike."], ["K-001"])
task("K-003", "Service the master cylinders and hoses", "chassis", "Critical", 1.5, "Master cylinder kits, new hoses",
     "Rebuild sticky master cylinders and replace any brake hoses that are cracked, bulging or very old.",
     "Old rubber hoses can swell inside and hold the brake on, or burst.", "Master cylinders working; hoses sound or replaced.",
     ["Check the master cylinder pistons return freely.", "Rebuild with a kit if the lever or pedal feels sticky.", "Replace rubber hoses that are cracked, bulging or more than about ten years old.", "Use new sealing washers on every banjo bolt."], ["K-001"])
task("K-004", "Bleed in fresh brake fluid", "chassis", "Critical", 1.5, "Bleed kit, wrench, rags",
     "Replace the brake fluid front and rear with the type on the reservoir cap, following the manual's order. On ABS bikes, follow the manual's ABS procedure.",
     "Brake fluid absorbs water and boils sooner. Air in the lines makes the brake spongy.", "Fresh fluid; firm lever and pedal; no leaks.",
     ["Cover painted parts; brake fluid strips paint.", "Bleed in the order the manual gives. ABS bikes may need a specific procedure.", "Never let the reservoir run dry.", "Finish when the lever and pedal are firm with no bubbles."], ["K-002", "K-003"])

task("L-001", "Service the forks", "chassis", "High", 3.0, "Fork seal driver, fork oil",
     "Replace the fork oil and seals, check the tubes for pitting and bends, and set the oil level from the manual.",
     "Leaking seals put oil on the brakes; worn oil makes the front dive and bounce.", "Forks dry, oil at the right level, damping smooth.",
     ["Check the tubes for pitting where the seals ride and roll them to check for bends.", "Drain the old oil and replace the seals and dust wipers.", "Fill with the oil type and level the manual gives, both legs the same.", "Pump the forks and check for leaks."], ["A-004"])
task("L-002", "Check the steering head bearings", "chassis", "Critical", 1.0, "Stand, steering stem wrench",
     "With the front wheel off the ground, check for notchiness and play, and adjust, grease or replace the bearings.",
     "Worn steering bearings make the bike weave and feel vague, and a notchy one can make it hard to hold a line.", "Steering smooth with no play.",
     ["Lift the front wheel safely.", "Turn the bars slowly lock to lock; feel for notches.", "Grip the fork legs and push and pull to feel for play.", "Adjust or replace as the manual describes. Tapered roller bearings are a common upgrade on older bikes."], ["A-004"])
task("L-003", "Check the rear shocks and swingarm bearings", "chassis", "High", 1.5, "Grease, stand",
     "Check the shock or shocks for leaks and damping, the swingarm pivot and any linkage for play, and grease the bearings.",
     "Dry swingarm bearings wear fast and make the rear end vague; a blown shock bounces.", "Shocks dry and damping; no play at the pivot; bearings greased.",
     ["Look for oil on each shock body.", "Push down on the rear and watch how it returns: one smooth return is good.", "With the rear wheel lifted, push the swingarm side to side to feel for play.", "Clean and grease the pivot and any linkage bearings."], ["A-004"])
task("L-004", "Lube and adjust the control cables and levers", "chassis", "Critical", 1.0, "Cable luber, light oil",
     "Lube the throttle and other cables, check they're not frayed, set throttle play, and check the levers, pedals and footpegs.",
     "A sticking throttle is one of the most dangerous faults a bike can have.", "Throttle snaps shut at both steering locks; cables lubed and adjusted; levers tight.",
     ["Lube each cable with a cable luber.", "Replace any cable that's frayed or kinked.", "Set throttle play and check it snaps shut with the bars turned fully both ways.", "Check the levers, pedals and pegs for play and damage."], [])
task("L-005", "Set the sag and suspension", "chassis", "Medium", 1.0, "Tape measure, helper",
     "Measure the sag with you on the bike and set the preload and any damping adjusters for your weight and load.",
     "The right sag makes the bike handle the way it was designed to.", "Sag and settings recorded.",
     ["Measure the height with the bike unloaded, then with you on it.", "Adjust preload until sag is in the range the manual or your suspension maker gives.", "Write the settings down in the project."], ["L-001", "L-003"])

task("M-001", "Plan the finish", "finish", "Low", 0.5, "",
     "Decide what gets refinished, what stays original, and who does each job, and record it.",
     "Planning the finish first stops you painting parts twice.", "A finish plan written for each part.",
     ["List each part that needs work: paint, powder coat, chrome, polish or leave.", "Decide what you do and what goes to a shop.", "Record it in Problems & decisions so the team agrees."], ["E-003"])

task("N-001", "Reassemble the bike", "finish", "Medium", 4.0, "Hand tools, torque wrench",
     "Reassemble the bike in reverse order using your labeled bags and photos, routing cables and wiring the way they came out.",
     "Correct fasteners and routing keep the bike quiet, safe and reliable.", "Every part fitted; no leftover fasteners; cables and wiring routed as before.",
     ["Work through your labeled bags in reverse order.", "Start every fastener by hand before tightening.", "Route cables and wiring exactly as your before photos show.", "Turn the bars lock to lock and check nothing pulls or pinches."], ["F-005", "G-007", "H-006", "L-004"])
task("N-002", "Torque-check the critical fasteners", "chassis", "Critical", 1.0, "Torque wrench, paint pen",
     "Check the axles, pinch bolts, caliper bolts, handlebar clamps, engine mounts and drain plugs against the manual's torque values.",
     "These are the fasteners that keep the wheels, brakes and engine attached.", "Each one checked, marked and initialed.",
     ["List the fasteners from the manual's torque table.", "Check each one and mark it with a paint pen.", "Have a second person check the list.", "Record who checked it."], ["N-001", "K-004"])
task("N-003", "First start after the rebuild", "engine", "High", 1.0, "Fire extinguisher, fresh fuel",
     "Prime the oil system if the manual says to, check for fuel leaks, start the engine and watch for leaks, smoke and warning lights.",
     "The first start is when fuel leaks and wiring mistakes show up. Have a fire extinguisher ready.", "Engine starts and idles; no fuel or oil leaks; warning lights normal.",
     ["Check the oil level and look for fuel leaks with the fuel on before cranking.", "Keep a fire extinguisher within reach.", "Start it and let it idle; watch for leaks, smoke and the warning lights.", "Shut it off and recheck the oil and coolant levels."], ["N-002"])
task("N-004", "Test ride and recheck", "chassis", "Critical", 1.5, "Helmet and gear",
     "Ride carefully, test the brakes at low speed first, then build up, and recheck for leaks, fluid levels and loose parts afterwards.",
     "The first ride is where small mistakes show up, while they're still cheap to fix.", "Ride notes recorded; nothing leaking or loose.",
     ["Start in a quiet area at low speed.", "Test both brakes at walking speed, then a bit faster.", "Check that the steering is free and nothing rubs.", "Afterward, look for leaks, recheck every fluid and the chain or belt."], ["N-003"])
task("N-005", "Set up the maintenance schedule", "general", "Low", 0.5, "",
     "Open the Maintenance log, check each schedule item against your manual, and mark the services you just did so their next due dates start counting.",
     "The log can only tell you what's due once it knows when things were done.", "Every schedule item has a start point.",
     ["Open the Maintenance log.", "Check each interval against your owner's manual and edit it.", "Log a service for the work you just did and pick the items it covered.", "Add receipts so the history holds up when you sell."], ["N-004"])
task("N-006", "Back up the project", "general", "Low", 0.2, "",
     "Download a backup from Settings.", "Your records are worth keeping somewhere safe.", "Backup file saved.",
     ["Open Settings & backups.", "Download a full backup.", "Keep it with the bike's paperwork."], ["N-005"])

BASE_PARTS = [("Engine", "engine", "Engine assembly"), ("Engine", "engine", "Cylinder head and valves"), ("Engine", "engine", "Clutch and clutch control"),
              ("Engine", "engine", "Oil filter and drain plug"), ("Engine", "engine", "Spark plugs and leads"), ("Engine", "engine", "Engine gaskets and seals"),
              ("Cooling", "engine", "Radiator, hoses and fan (or cooling fins)"), ("Exhaust", "engine", "Exhaust system"),
              ("Fuel", "fuel", "Fuel tank"), ("Fuel", "fuel", "Petcock or fuel pump"), ("Fuel", "fuel", "Fuel lines and filters"),
              ("Fuel", "fuel", "Carburetors or throttle bodies"), ("Fuel", "fuel", "Air filter and intake boots"), ("Fuel", "fuel", "Throttle cables"),
              ("Electrical", "electrical", "Battery"), ("Electrical", "electrical", "Stator or alternator"), ("Electrical", "electrical", "Regulator/rectifier"),
              ("Electrical", "electrical", "Wiring harness and grounds"), ("Electrical", "electrical", "Starter motor and relay"), ("Electrical", "electrical", "Ignition system"),
              ("Electrical", "electrical", "Headlight and turn signals"), ("Electrical", "electrical", "Tail and brake light"), ("Electrical", "electrical", "Switches and controls"),
              ("Electrical", "electrical", "Instruments and warning lights"), ("Chassis", "chassis", "Frame"), ("Chassis", "chassis", "Swingarm and pivot bearings"),
              ("Chassis", "chassis", "Front forks"), ("Chassis", "chassis", "Rear shocks"), ("Chassis", "chassis", "Steering head bearings"),
              ("Wheels", "chassis", "Front wheel and bearings"), ("Wheels", "chassis", "Rear wheel and bearings"), ("Wheels", "chassis", "Front tire"), ("Wheels", "chassis", "Rear tire"),
              ("Brakes", "chassis", "Front brake caliper(s) and pads"), ("Brakes", "chassis", "Rear brake"), ("Brakes", "chassis", "Brake discs or drums"),
              ("Brakes", "chassis", "Master cylinders and brake hoses"), ("Controls", "chassis", "Handlebars, levers and mirrors"), ("Controls", "chassis", "Footpegs and pedals"),
              ("Cosmetics", "finish", "Seat"), ("Cosmetics", "finish", "Side covers"), ("Cosmetics", "finish", "Stands")]

BASE_INSP = [("Battery", "Battery voltage after full charge", "V", "Multimeter", True), ("Regulator/rectifier", "Charging voltage at the battery, engine running", "V", "Multimeter", True),
             ("Engine assembly", "Compression, every cylinder", "psi", "Compression gauge", False), ("Cylinder head and valves", "Valve clearances, engine cold", "mm", "Feeler gauges", False),
             ("Spark plugs and leads", "Spark plug type and gap", "mm", "Gap gauge", False), ("Throttle cables", "Throttle free play and return", "mm", "Ruler", True),
             ("Clutch and clutch control", "Clutch free play", "mm", "Ruler", False), ("Front tire", "Front tire tread depth and date code", "mm", "Tread gauge", True),
             ("Rear tire", "Rear tire tread depth and date code", "mm", "Tread gauge", True), ("Brake discs or drums", "Disc thickness or drum wear", "mm", "Micrometer", True),
             ("Front brake caliper(s) and pads", "Front pad thickness", "mm", "Ruler", True), ("Rear brake", "Rear pad or shoe thickness", "mm", "Ruler", True),
             ("Steering head bearings", "Steering play and notchiness", "", "By hand", True), ("Front forks", "Fork seals dry, damping smooth", "", "Visual", True),
             ("Rear shocks", "Rear sag with rider", "mm", "Tape measure", False), ("Radiator, hoses and fan (or cooling fins)", "Coolant level and condition, or fins clear", "", "Visual", False),
             ("Front wheel and bearings", "Wheel runout and bearing play", "mm", "Dial indicator", True)]

BASE_CHECKS = [("Recalls", "Every recall done or booked", "High", "A-002", "NHTSA lookup shows no open recalls, or dealer work booked in writing. Not applicable on pre-1981 bikes with no record."),
               ("Fasteners", "Critical fasteners torque-checked", "Critical", "N-002", "Axles, pinch bolts, caliper bolts, bar clamps and engine mounts checked to the manual's values and marked."),
               ("Brakes", "Front brake firm and strong", "Critical", "K-004", "Firm lever, no leaks, pads and disc in limits."),
               ("Brakes", "Rear brake firm and strong", "Critical", "K-004", "Firm pedal, no leaks, pads or shoes in limits."),
               ("Tires", "Tires in date, tread and pressure", "Critical", "J-001", "Date codes recorded, tread above the legal minimum, pressures set."),
               ("Wheels", "Wheel bearings, rims and axles", "Critical", "J-003", "No play, no cracks, spokes tight, axles torqued."),
               ("Steering", "Steering free with no play", "Critical", "L-002", "Turns lock to lock smoothly, no play, no cable pull."),
               ("Suspension", "Forks and shocks not leaking", "High", "L-001", "Tubes and shocks dry after compressions."),
               ("Lights", "Headlight, signals, tail and brake light", "Critical", "F-005", "Brake light works from lever and pedal."),
               ("Controls", "Throttle snaps shut, clutch frees", "Critical", "L-004", "Throttle returns with bars at both locks; clutch fully disengages."),
               ("Fluids", "Oil and coolant correct, no leaks", "High", "H-001", "Levels correct; drain plugs and filter dry."),
               ("Fuel", "No fuel leaks", "Critical", "G-003", "Lines, petcock or pump and carbs or injectors dry with the fuel on and engine running."),
               ("Stand", "Side stand holds and springs up", "High", "N-004", "Stand returns fully; side-stand switch works if fitted.")]

BASE_GATES = [("Bike identified and recalls checked", "A-001;A-002;A-003", "Model, VIN, engine number and recall status recorded."),
              ("Condition recorded and job list agreed", "B-001;B-002;B-003;B-006", "Before photos, fluid checks, compression and the job list are in the app."),
              ("Electrical and charging pass", "F-001;F-002;F-003;F-004;F-005", "Battery, charging readings, spark and lights all pass."),
              ("Fuel system done", "G-001;G-002;G-003;G-006;G-007", "Tank clean, lines new, carbs or injection serviced, sync done."),
              ("Engine service done", "H-001;H-002;H-003;H-004;H-005", "Oil, plugs, valves, cooling and clutch done or recorded as not needed."),
              ("Final drive passes", "I-001;I-002;I-003", "Final drive in limits and serviced."),
              ("Wheels, tires and brakes pass", "J-001;J-002;J-003;K-001;K-002;K-004", "All in limits with fresh brake fluid."),
              ("Suspension and steering pass", "L-001;L-002;L-003;L-004", "No leaks, no steering play, cables lubed."),
              ("Road test passed", "N-001;N-002;N-003;N-004", "Fasteners checked, first start clean, ride done, recheck clean.")]

BASE_SCHED = [("Engine oil and filter", "Engine", 3000, 12), ("Tire pressure and tread check", "Tires & wheels", 0, 1), ("Brakes inspect", "Brakes", 3000, 6),
              ("Brake fluid replace", "Brakes", 0, 24), ("Air filter clean or replace", "Fuel & air", 6000, 12), ("Spark plugs", "Engine", 6000, 24),
              ("Valve clearance check", "Engine", 6000, 24), ("Battery check and charge", "Electrical", 0, 1), ("Fork oil replace", "Suspension & steering", 12000, 24),
              ("Steering head bearings check", "Suspension & steering", 6000, 12), ("Fuel lines and filter check", "Fuel & air", 6000, 12), ("Control cables lube and adjust", "Controls & cables", 3000, 12)]

BASE_TOOLS = [("Torque wrench", "Measuring tool", "Every fastener with a torque value in the manual."), ("Multimeter", "Measuring tool", "Battery, charging and circuit tests."),
              ("Smart battery charger", "Electrical", "Charging and maintaining the battery."), ("Stand or lift", "Workshop", "Holding the bike securely."),
              ("Compression gauge", "Measuring tool", "Compression test."), ("Feeler gauges", "Measuring tool", "Valve clearances and plug gaps."),
              ("Brake bleed kit", "Brakes", "Brake fluid replacement."), ("Metric socket and wrench set", "Hand tool", "Most fasteners."),
              ("Tire pressure and tread gauges", "Measuring tool", "Tire checks."), ("Drain pan and funnels", "Workshop", "Oil and coolant changes."),
              ("Vacuum sync gauges", "Measuring tool", "Synchronizing carbs or throttle bodies."), ("Fire extinguisher", "Safety", "First start and any work near fuel.")]

BASE_PUR = [("Service manual for your model and year", "", "A-003", "Reference / Tool", 1), ("Oil filter and drain plug washer", "Oil filter and drain plug", "H-001", "OEM / Aftermarket", 1),
            ("Engine oil (type and amount from the manual)", "Engine assembly", "H-001", "OEM / Aftermarket", 1), ("Air filter", "Air filter and intake boots", "G-006", "OEM / Aftermarket", 1),
            ("Spark plugs (type from the manual)", "Spark plugs and leads", "H-002", "OEM / Aftermarket", 1), ("Brake fluid (type on the reservoir cap)", "Master cylinders and brake hoses", "K-004", "OEM / Aftermarket", 1),
            ("Ethanol-rated fuel line and clamps", "Fuel lines and filters", "G-003", "Aftermarket", 1)]

BASE_GUIDES = {
    "paint": None, "carbs": {"cover": "fuel", "icon": "fuel", "title": "Carburetors 101", "img": None, "sum": "How carbs work, why they fail and how to rebuild them.", "body": [
        ["What they do", "A carburetor mixes fuel with air. Opening the throttle lets in more air, and jets and a needle meter in more fuel to match."],
        ["Why they fail", "Old fuel turns to varnish and blocks the tiny jets and passages. Rubber parts harden and leak. Floats stick, so carbs overflow or starve."],
        ["Rebuild basics", "Work on one carb at a time so parts never mix. Photograph everything, clean every passage, fit new gaskets, O-rings and needle valves, and set the float height to the manual's figure."],
        ["Settings", "Jet sizes, needle positions and float height come from the manual for your carb model. Write down what you find before changing anything, in case someone modified them."],
        ["After the rebuild", "On multi-cylinder bikes, the carbs are synchronized with vacuum gauges so each cylinder pulls the same. Then set the idle."]]},
    "efi": {"title": "Fuel injection basics", "img": None, "cover": "fuel", "icon": "fuel", "sum": "How injection works and what you actually service.", "body": [
        ["What it does", "A computer reads sensors (throttle position, air, temperature) and opens an injector for each cylinder for just the right time. There's nothing to jet like on a carb."],
        ["What you service", "The fuel filter and pump, the fuel lines, the air filter, the throttle cable play and, on multi-cylinder bikes, the balance between throttle bodies."],
        ["Warning signs", "A flashing or steady FI light, hard starting or surging. Read the fault code the way the manual shows before replacing anything."]]},
    "charging": {"title": "Charging system checks", "img": None, "cover": "electrical", "icon": "bolt", "sum": "Battery, stator and regulator: how to tell which one is failing.", "body": [
        ["How it works", "The stator or alternator makes power as the engine turns. The regulator/rectifier turns it into steady DC for the battery and lights."],
        ["Start with the battery", "Charge it fully and test it. A tired battery makes everything else look broken."],
        ["Then the connector", "Look at the plug between the stator and the regulator. Brown, melted or loose pins mean heat, and heat means trouble."],
        ["Then measure", "Use the manual's charging test: voltage at the battery at set engine speeds, then the stator and regulator tests. Compare every reading with the manual."]]},
    "electrical": {"img": None, "icon": "bolt", "cover": "electrical"},
    "brakes": {"img": None, "icon": "shield", "cover": "brakes", "sum": "Disc and drum brakes, what wears out, and how to bleed them."},
    "wheels": {"title": "Wheels & tires", "img": None, "cover": "wheels", "icon": "wheel", "sum": "Reading a tire's age, wheel bearings, spokes and cast wheels.", "body": [
        ["Tire age", "Every tire has a four-digit date code on the sidewall: the week, then the year (2319 is week 23 of 2019). Old rubber gets hard and slippery even with tread left."],
        ["Sizes", "Use the sizes and load and speed ratings in your manual or on the tire placard on the bike."],
        ["Bearings", "With the wheel off the ground, rock it at the top and bottom and spin it. Any play or grinding means new bearings."],
        ["Spokes and cast wheels", "Spoked wheels need tight spokes and a true rim. Cast wheels need checking for cracks. A cracked cast wheel is replaced, never repaired."]]},
    "cleaning": {"img": None, "icon": "spray", "cover": "tools"},
    "organizing": {"img": None, "icon": "box", "cover": "tools"},
    "measuring": {"img": None, "icon": "gauge", "cover": "tools"},
    "safety": {"img": None, "icon": "shield", "cover": "tools"},
}

BASE_SHOPS = {
    "fiche": {"name": "Factory parts diagrams", "url": "https://www.revzilla.com/oem", "short": "Diagrams for your bike", "what": "Exploded diagrams and part numbers by area of the bike. Pick your make, year and model.", "tags": ["Original parts", "Diagrams"]},
    "nhtsa": {"name": "NHTSA recall lookup", "url": "https://www.nhtsa.gov/recalls", "short": "Check recalls by VIN", "what": "Enter the VIN to see open safety recalls. Recall repairs are free at a dealer.", "tags": ["Recalls", "Free"]},
    "manuals": {"name": "Haynes / Clymer manuals", "url": "https://haynes.com", "short": "Repair manuals", "what": "Repair manuals for most popular bikes. Still try to get the factory service manual for exact specs.", "tags": ["Manuals"]},
    "cmsnl": {"name": "CMSNL", "url": "https://www.cmsnl.com", "short": "Original parts diagrams", "what": "Factory diagrams and part numbers going back to the 1960s, strong on older Japanese bikes. Ships worldwide.", "tags": ["Original parts", "Diagrams"]},
    "partzilla": {"name": "Partzilla", "url": "https://www.partzilla.com", "short": "Diagrams, US shipping", "what": "Factory diagrams and part numbers for most Japanese brands, shipped from the US.", "tags": ["Original parts", "Diagrams"]},
    "gsr": None, "sudco": None, "z1": {"name": "Z1 Enterprises", "url": "https://www.z1enterprises.com", "short": "Vintage Japanese bike parts", "what": "Gaskets, seals, cables, carb kits and hardware for older Japanese bikes.", "tags": ["Vintage", "Kits"]},
}
BASE_CATSHOPS = {"Engine": ["fiche", "partzilla", "cmsnl"], "Cooling": ["fiche", "revzilla"], "Fuel": ["fiche", "partzilla", "caswell"], "Exhaust": ["fiche", "ebay"], "Electrical": ["ricks", "fiche"],
                 "Chassis": ["allballs", "fiche"], "Wheels": ["allballs", "revzilla", "denniskirk"], "Brakes": ["fiche", "revzilla", "denniskirk"],
                 "Final drive": ["revzilla", "denniskirk"], "Controls": ["fiche", "revzilla"], "Cosmetics": ["fiche", "ebay"], "_default": ["fiche", "partzilla"]}

BASE_SUGG = [["Get the service manual first", "Every spec in this course says VERIFY until it comes from the manual for your exact model and year."],
             ["Do the compression test early", "It decides whether the engine needs opening up, the biggest cost decision in the project."],
             ["Buy kits as sets", "Gasket sets, carb kits and seal kits usually cost less than single pieces and nothing gets missed."],
             ["Replace old rubber", "Fuel lines, brake hoses, intake boots and tires harden with age even if they look fine."],
             ["Compare the delivered price", "Add shipping and tax before deciding which shop is cheapest."],
             ["Ask an owners' forum", "Owners of your model have solved most of its problems before."]]


# ====================================================================== tailoring by kind of bike
STYLES = {
    "standard": dict(name="Standard", noun="standard", drive="chain",
        intro="A standard or naked bike: upright, simple, with most of the engine in plain view.",
        focus=[("Exposed engine", "Leaks and finish show"), ("Simple bodywork", "Tank, seat, side covers"),
               ("Carbs or EFI", "Both are covered"), ("Disc brakes", "Calipers and fluid"), ("Twin shocks or mono", "Rear suspension check")],
        strip=dict(about="Remove the seat, side covers and fuel tank, plus the headlight shell or small fly screen if it has one, so you can reach the engine, wiring and frame. Bag and label every fastener.",
                   tips=["Photograph the wiring inside the headlight shell before unplugging anything.", "Drain the tank before lifting it off.", "One bag per area, labeled."]),
        finish=dict(title="Paint & finish", short="Tank and side cover paint, frame finish, polish and chrome.",
                    about="Refinish the tank and side covers, protect or refinish the frame, and bring back the polished and chrome parts.",
                    why="On a naked bike the tank, frame and engine are the whole look, and good paint protects the metal under it.",
                    tips=["Use a fuel-resistant clear on the tank. Most are 2K and need a proper respirator or a shop.", "Powder coat is the toughest finish for a frame.", "Pitted chrome needs a plating shop, not polish."]),
        finish_tasks=[("M-002", "Refinish the tank and side covers", "finish", "Medium", 8.0, "Primer, paint, 2K clear, or a paint shop",
                       "Strip, repair, prime and paint the tank and side covers, with a fuel-resistant clear on the tank.",
                       "The tank takes fuel spills and knee rub; it needs the toughest finish on the bike.", "Tank and covers painted and cured; no runs; clear is fuel-proof.",
                       ["Make the tank safe first: drained, rinsed and vapor-free. Never heat or grind a tank that has held fuel.", "Strip, fix dents, prime and block sand.", "Spray color, then a fuel-resistant clear.", "Let it cure fully before fitting."], ["M-001", "G-002"]),
                      ("M-003", "Frame, engine and brightwork", "finish", "Low", 4.0, "Degreaser, engine paint, polish",
                       "Touch up or refinish the frame, clean and protect the engine finish, and polish or replate the bright parts.",
                       "On a naked bike these parts are always in view.", "Frame protected; engine clean and sealed; bright parts polished.",
                       ["Touch up frame chips or send the frame for powder coat while it's stripped.", "Clean the engine and use a high-temp paint or clear where needed.", "Polish aluminum and chrome; send badly pitted chrome to a plating shop."], ["M-001"])],
        extra=[], drop=[], sched=[], parts=[("Cosmetics", "finish", "Fuel tank paint and badges")],
        guide=("standard", "Restoring a standard bike", "What to focus on when restoring a standard or naked bike.", [
            ["Everything is on show", "With no fairing to hide behind, leaks, rust and tired paint are all visible. A clean engine and fresh paint make the biggest difference."],
            ["Simple to strip", "Seat, side covers and tank come off quickly, which makes standards a good first restoration."],
            ["Common jobs", "Carb rebuild or injection service, chain and sprockets, brakes, fork seals and tires cover most standards."]]),
        sugg=[["Start with the tank", "A clean, sealed tank stops rust and varnish wrecking the fuel system you just rebuilt."]]),
    "cruiser": dict(name="Cruiser", noun="cruiser", drive="belt",
        intro="A cruiser: low seat, big twin, lots of chrome, and often a belt or shaft instead of a chain.",
        focus=[("Big V-twin", "Valves, leaks, primary drive"), ("Chrome and polish", "The look of the bike"),
               ("Tins and fenders", "Paint and dents"), ("Bags and accessories", "Mounts and wiring"), ("Long cables", "Lube and routing")],
        strip=dict(about="Remove the seat, saddlebags and their mounts, side covers and the fuel tank, plus the console if the tank has one. Bag and label every fastener, and note where accessory wiring goes.",
                   tips=["Many cruiser tanks carry a console with the gauges and wiring. Photograph the connections first.", "Saddlebag mounts often share bolts with the fenders or shocks. Bag them separately.", "Chrome scratches easily. Lay parts on towels."]),
        finish=dict(title="Chrome, paint & polish", short="Chrome care and plating, tins and fenders, and polished aluminum.",
                    about="Bring the chrome back or send it for plating, refinish the tank and fenders, and polish the aluminum covers. On a cruiser, the finish is half of the bike.",
                    why="Cruisers are judged on their chrome and paint. Pitted chrome also rusts through if it's left.",
                    tips=["Light rust on chrome often polishes off with chrome polish and #0000 steel wool.", "Pitted chrome needs replating or replacement.", "Long fenders flex: check the mounts for cracks before painting."]),
        finish_tasks=[("M-002", "Restore the chrome", "finish", "Low", 6.0, "Chrome polish, #0000 steel wool, or a plating shop",
                       "Clean and polish the chrome, and replate or replace anything pitted or peeling.",
                       "Pitted chrome keeps rusting under the surface.", "Chrome clean and protected; pitted parts replated or replaced.",
                       ["Wash and degrease, then polish with chrome polish.", "Use #0000 steel wool with polish on light rust only.", "Send pitted or peeling parts to a plating shop, or replace them.", "Protect with a wax made for chrome."], ["M-001"]),
                      ("M-003", "Refinish the tank and fenders", "finish", "Medium", 10.0, "Primer, paint, 2K clear, or a paint shop",
                       "Strip, repair, prime and paint the tank and fenders, with a fuel-resistant clear on the tank.",
                       "The tins are the centerpiece of a cruiser and need a finish that stands up to fuel and road grit.", "Tins painted and cured; fender mounts sound.",
                       ["Make the tank safe first: drained, rinsed and vapor-free.", "Check fender mounts and struts for cracks before painting.", "Strip, fix dents, prime, block sand, color and clear.", "Let it cure fully before fitting."], ["M-001", "G-002"]),
                      ("M-004", "Polish the aluminum covers", "finish", "Low", 3.0, "Metal polish, buffing wheel",
                       "Clean and polish the engine and primary covers, or refinish them if they're coated.",
                       "Clean covers make leaks easy to spot from then on.", "Covers clean and polished or refinished.",
                       ["Check whether the covers are bare, clear-coated or painted before polishing.", "Strip old clear coat if it's peeling.", "Polish bare aluminum and protect it."], ["M-001"])],
        extra=[("D-004", "Remove the saddlebags and accessories", "finish", "Low", 1.0, "Hex keys, wrenches",
                "Remove the saddlebags, windshield, backrest and any accessory lights or rails, noting how accessory wiring is connected.",
                "Accessories hide mounting points and wiring you need to inspect, and they're easy to scratch.", "Accessories off and stored; accessory wiring labeled.",
                ["Photograph each accessory before removing it.", "Label any accessory wiring and where it taps into the harness.", "Store bags and screens on soft surfaces."], ["D-001"])],
        drop=[], sched=[], parts=[("Cosmetics", "finish", "Tank and fenders"), ("Cosmetics", "finish", "Chrome trim and covers"), ("Cosmetics", "finish", "Saddlebags and windshield")],
        guide=("cruiser", "Restoring a cruiser", "Belt drives, big twins and chrome.", [
            ["Drive", "Many cruisers use a toothed belt; others use a shaft or a chain. The course follows the final drive you picked when you added the bike."],
            ["The engine", "Big V-twins often have separate oil for the primary drive and sometimes the transmission. Check the manual for how many oils your bike takes."],
            ["Hydraulic lifters", "Many cruiser engines use hydraulic lifters that need no valve adjustment. Check yours before buying feeler gauges."],
            ["Chrome", "Chrome is the look. Polish what's sound, replate what's pitted."]]),
        sugg=[["Count the oils", "Engine, primary and transmission can each have their own oil on some cruisers."], ["Check for hydraulic lifters", "If your engine has them, cancel the valve clearance step."]]),
    "sport": dict(name="Sport", noun="sport bike", drive="chain",
        intro="A sport bike: full fairings, liquid cooling, high revs and adjustable suspension.",
        focus=[("Full fairings", "Mounts, tabs and crash damage"), ("Liquid cooling", "Radiator, fan, coolant"), ("High-rev engine", "Valves and sync"),
               ("Adjustable suspension", "Sag, preload, damping"), ("Sport tires", "Age and profile")],
        strip=dict(about="Remove the seat, tail section, side and lower fairings, upper fairing if needed, and the fuel tank. Many fairing panels are held by hidden screws and plastic tabs, so follow the manual's order. Bag and label every fastener.",
                   tips=["Fairing tabs crack when cold. Work in a warm garage.", "Use a plastic trim tool, never a screwdriver, on clips.", "Photograph each panel's screw locations; sport bikes use many lengths."]),
        finish=dict(title="Fairings & finish", short="Fairing repair and paint, crash damage, and screen and decals.",
                    about="Repair cracked fairing tabs and panels, paint or replace damaged bodywork, and refit a clean screen and decals.",
                    why="Cracked fairing tabs let panels vibrate and break further, and crash damage often hides under bodywork.",
                    tips=["Plastic welding kits repair most cracked tabs.", "Use flexible primer and adhesion promoter on plastic.", "Aftermarket fairings rarely fit as well as original ones."]),
        finish_tasks=[("M-002", "Repair the fairing tabs and cracks", "finish", "Medium", 4.0, "Plastic welding kit, mesh",
                       "Repair cracked or broken fairing tabs and panel cracks from behind, and replace panels that are too far gone.",
                       "Broken tabs let panels vibrate loose and crack further.", "Every panel mounts securely with no cracks at the tabs.",
                       ["Clean and identify the plastic (often stamped inside, like ABS or PP).", "Repair from the back with a plastic welder and mesh.", "Replace panels with large cracks across the face."], ["M-001"]),
                      ("M-003", "Paint the bodywork or fit new panels", "finish", "Medium", 8.0, "Flexible primer, paint, clear, or a shop",
                       "Paint repaired panels with a flexible primer system, or fit replacements, and refit a clean screen and decals.",
                       "Plastic needs a different primer from metal or the paint flakes.", "Panels painted or replaced; screen clear; decals on.",
                       ["Scuff, clean and use adhesion promoter on plastic.", "Use a flexible primer and clear made for plastic.", "Replace a scratched or crazed screen.", "Check every panel fits before final paint."], ["M-002"])],
        extra=[("E-005", "Check for crash damage under the fairings", "chassis", "Critical", 1.0, "Flashlight",
                "With the fairings off, look for crash damage: bent clip-ons, cracked fairing brackets, dented exhaust, bent rearsets and scraped engine covers.",
                "Sport bikes hide crash damage under bodywork, and a bent part can affect steering.", "Crash damage logged with photos, or none found.",
                ["Check the clip-ons and the triple clamp for bends.", "Look at the fairing stay and subframe for cracks.", "Check engine covers and frame sliders for scrapes and cracks.", "Check the rearsets and shift and brake pedals."], ["D-001", "E-001"])],
        drop=[], sched=[("Coolant replace", "Cooling", 0, 24)], parts=[("Cosmetics", "finish", "Fairing panels and tabs"), ("Cosmetics", "finish", "Windscreen"), ("Chassis", "chassis", "Clip-ons and rearsets")],
        guide=("sport", "Restoring a sport bike", "Fairings, cooling, suspension and crash damage.", [
            ["Look under the plastic", "Sport bikes are often dropped. Take the fairings off and check brackets, clip-ons, the subframe and the radiator for damage."],
            ["Cooling", "Liquid cooling works hard on a sport bike. Fresh coolant, straight radiator fins and a working fan matter."],
            ["Suspension", "Most sport bikes have adjustable suspension. Set the sag for your weight, then start damping from the manual's standard settings."],
            ["Tires", "Sport tires age and wear quickly. Check the date codes, not just the tread."]]),
        sugg=[["Buy the fairing screw kit", "A full fairing bolt kit is cheap and replaces the mismatched screws most used sport bikes have."]]),
    "adventure": dict(name="Adventure", noun="adventure bike", drive="chain",
        intro="An adventure bike: long-travel suspension, tall stance, crash protection and luggage.",
        focus=[("Crash bars and skid plate", "Damage hides behind them"), ("Luggage mounts", "Racks and side cases"), ("Long-travel suspension", "Fork, shock, linkage"),
               ("Spoked or cast wheels", "Spokes or cracks"), ("ABS", "Sensors and warning light")],
        strip=dict(about="Remove the luggage, racks, crash bars and skid plate, then the seat, side panels, any fairing and the fuel tank. Bag and label every fastener; crash bar bolts often go into the engine mounts.",
                   tips=["Crash bar bolts often share engine mount bolts. Support the engine if the manual says to.", "Photograph accessory wiring for lights, heated grips and power sockets.", "Check under the skid plate for oil leaks and dents."]),
        finish=dict(title="Protection, luggage & finish", short="Crash bars, skid plate, luggage and paint touch-up.",
                    about="Straighten or replace bent protection, check the luggage mounts and racks for cracks, and touch up the paint and plastics.",
                    why="Adventure bikes are built to take hits. Bent protection and cracked racks need fixing before they fail on the trail.",
                    tips=["A bent crash bar can stress the engine mounts.", "Check rack welds for cracks under the paint.", "Plastic panels can usually be repaired from behind."]),
        finish_tasks=[("M-002", "Check crash bars, skid plate and racks", "finish", "Medium", 2.0, "Flashlight, wrenches",
                       "Check the crash bars, skid plate and luggage racks for bends and cracks, and straighten, repair or replace them.",
                       "Bent protection can stress the frame and engine mounts.", "Protection straight and sound; racks crack-free.",
                       ["Look at every weld on the racks and bars.", "Replace bars that are bent near their mounts.", "Check the skid plate mounts and replace missing rubber."], ["M-001"]),
                      ("M-003", "Touch up paint and plastics", "finish", "Low", 4.0, "Touch-up paint, plastic repair kit",
                       "Touch up chips on the frame and tank, repair cracked plastics, and refit the screen.",
                       "Chips on a trail bike rust quickly.", "Chips sealed; plastics repaired; screen fitted.",
                       ["Clean and touch up every chip on steel parts.", "Repair cracked plastics from behind.", "Refit the screen and check its adjuster."], ["M-001"])],
        extra=[("D-004", "Remove luggage, crash bars and skid plate", "finish", "Low", 1.5, "Hex keys, wrenches, jack or engine support",
                "Remove the side cases, top box, racks, crash bars and skid plate, noting accessory wiring.",
                "Protection and luggage hide the engine, frame and wiring you need to inspect.", "Luggage and protection off; bolts bagged; accessory wiring labeled.",
                ["Support the engine if crash bar bolts go through the engine mounts.", "Photograph and label accessory wiring.", "Bag bolts by part; lengths differ."], ["D-001"]),
               ("J-005", "Check the spokes or tubeless conversion", "chassis", "High", 0.5, "Spoke wrench",
                "On spoked wheels, check spoke tension and the rim seal if they're tubeless; on cast wheels, check closely for cracks from impacts.",
                "Adventure wheels take hard hits from rocks and potholes.", "Spokes tight or cracks ruled out; rim seals sound.",
                ["Tap each spoke; dull ones are loose.", "On tubeless spoked rims, check for slow leaks around the spoke nipples.", "On cast wheels, look closely near the rim edge for impact cracks."], ["J-003"])],
        drop=[], sched=[("Coolant replace", "Cooling", 0, 24)], parts=[("Chassis", "chassis", "Crash bars and skid plate"), ("Cosmetics", "finish", "Luggage racks and cases"), ("Electrical", "electrical", "ABS sensors and accessory wiring")],
        guide=("adventure", "Restoring an adventure bike", "Protection, luggage, suspension and dust.", [
            ["Take the armor off", "Crash bars, skid plates and racks hide leaks, cracks and damage. They all come off first."],
            ["Dust", "Dusty riding destroys air filters and fork seals. Check the airbox for dirt past the filter."],
            ["Suspension", "Long-travel suspension needs fresh oil and greased linkage bearings to work well, especially loaded with luggage."],
            ["Accessory wiring", "Heated grips, lights and power sockets are often added by owners. Check every connection and fuse."]]),
        sugg=[["Check behind the skid plate", "Oil leaks and dented oil filters hide there."]]),
    "dualsport": dict(name="Dual-sport", noun="dual-sport", drive="chain",
        intro="A dual-sport or dirt bike: light, simple, spoked wheels, and hard on air filters and bearings.",
        focus=[("Foam air filter", "Clean and re-oil"), ("Spoked wheels", "Tension, rim locks, tubes"), ("Linkage bearings", "Mud and water"), ("Plastics", "Fenders and side panels"), ("Simple electrics", "Often minimal")],
        strip=dict(about="Remove the seat, side panels, shrouds and fuel tank, and the skid plate if fitted. Bag and label every fastener; plastics often use the same bolt in several sizes.",
                   tips=["Plastics are brittle when cold. Work in a warm space.", "Shroud bolts often go into the radiator mounts. Don't overtighten them back.", "Check under the skid plate for dents in the frame rails."]),
        finish=dict(title="Plastics & graphics", short="Fenders, shrouds, side panels and graphics.",
                    about="Clean, repair or replace the plastics and fit new graphics.",
                    why="Cracked plastics break off on the trail and look tired. They're cheap to replace on most dual-sports.",
                    tips=["Most plastics can't be painted well; replace them instead.", "Heat-gun out light scratches carefully.", "New graphics stick best on new or very clean plastic."]),
        finish_tasks=[("M-002", "Repair or replace the plastics", "finish", "Low", 2.0, "Plastic cleaner, plastic welder",
                       "Clean the plastics, repair small cracks from behind, and replace cracked or faded panels.",
                       "Cracked plastics break off on the trail.", "Plastics sound and mounted securely.",
                       ["Clean with a plastic-safe cleaner.", "Repair small cracks from behind.", "Replace panels with cracks at the mounts."], ["M-001"]),
                      ("M-003", "Fit new graphics", "finish", "Low", 1.5, "Heat gun, cleaner",
                       "Strip old graphics, clean the plastic thoroughly and fit new graphics.",
                       "Graphics protect the plastic and make the bike look new.", "Graphics on, no bubbles.",
                       ["Warm old graphics and peel them off.", "Remove adhesive and clean with the cleaner the graphics maker gives.", "Apply from the center outwards."], ["M-002"])],
        extra=[("J-005", "Check spoke tension, rim locks and tubes", "chassis", "High", 1.0, "Spoke wrench, tire irons",
                "Check every spoke for tension, check the rim lock if fitted, and replace old tubes and rim tape.",
                "Loose spokes break and bend rims; old tubes split on the trail.", "Spokes tight; rim lock tight; new tubes and rim tape.",
                ["Tap each spoke; tighten loose ones a quarter turn at a time.", "Check the rim lock nut.", "Fit new heavy-duty tubes and rim tape when the tires are off."], ["J-003"])],
        drop=["G-007"], sched=[("Air filter clean and re-oil", "Fuel & air", 500, 3), ("Spoke tension check", "Tires & wheels", 500, 3)],
        parts=[("Cosmetics", "finish", "Plastics and graphics"), ("Wheels", "chassis", "Spokes, rim locks and tubes"), ("Chassis", "chassis", "Suspension linkage bearings")],
        guide=("dualsport", "Restoring a dual-sport", "Air filters, spokes, bearings and plastics.", [
            ["Air filter", "Most use an oiled foam filter. Clean it with filter cleaner, dry it, oil it with filter oil, and grease the sealing edge."],
            ["Bearings", "Mud and pressure washers wash the grease out of wheel, swingarm, linkage and steering bearings. Check and grease them all."],
            ["Spokes", "Off-road wheels need regular spoke checks."],
            ["Single cylinder", "Most dual-sports are singles: no sync needed, but valve clearances matter even more."]]),
        sugg=[["Grease every bearing", "Wheel, steering, swingarm and linkage bearings on dirt bikes are usually dry."]]),
    "touring": dict(name="Touring", noun="touring bike", drive="shaft",
        intro="A touring bike: big fairing, luggage, comfort features, and often a shaft drive and linked brakes.",
        focus=[("Big fairing", "Many panels and fasteners"), ("Luggage and locks", "Hinges, seals, mounts"),
               ("Accessory wiring", "Radios, grips, lights"), ("Linked or ABS brakes", "Bleeding procedure"), ("Heavy bike", "Stand and lifting")],
        strip=dict(about="Remove the luggage, seat, side covers, fairing panels needed for access and the fuel tank. Touring fairings have many panels and fasteners and the manual's order matters. Bag and label every fastener, and label every accessory connector.",
                   tips=["Touring bikes are heavy. Use a proper lift or center stand and get help.", "Label every connector in the fairing; there are many.", "Bag fasteners by panel; they rarely interchange."]),
        finish=dict(title="Fairing, luggage & comfort", short="Fairing and luggage, locks and seals, seat and screen.",
                    about="Repair and refinish the fairing and luggage, service the locks, hinges and seals, and refresh the seat and screen.",
                    why="Leaking luggage and rattling panels ruin a tour, and they're easy to fix while the bike is apart.",
                    tips=["Lube locks with graphite or a lock lubricant, not oil.", "Replace hardened luggage seals.", "A scratched screen can sometimes be polished; crazed ones need replacing."]),
        finish_tasks=[("M-002", "Service the luggage, locks and seals", "finish", "Low", 2.0, "Lock lubricant, new seals",
                       "Check the side cases and top box for cracks, lube the locks and hinges, and replace hardened seals.",
                       "Leaking luggage soaks everything inside on the first rainy tour.", "Cases sealed; locks and hinges working.",
                       ["Check each case and its mounts for cracks.", "Lube the locks and hinges.", "Replace seals that are hard or cracked, then water-test the cases."], ["M-001"]),
                      ("M-003", "Refinish the fairing and refresh the screen and seat", "finish", "Medium", 6.0, "Paint or touch-up, plastic repair kit",
                       "Repair cracked fairing tabs, touch up or repaint the bodywork, and polish or replace the screen and recover or repair the seat.",
                       "Cracked tabs rattle and break further; a crazed screen is hard to see through.", "Fairing sound and finished; screen clear; seat sound.",
                       ["Repair tabs from behind with a plastic welder.", "Touch up or repaint panels.", "Polish light screen scratches or replace a crazed screen.", "Repair or recover the seat."], ["M-001"])],
        extra=[("D-004", "Remove the luggage", "finish", "Low", 0.5, "Keys, hex keys",
                "Remove the side cases and top box and their mounts, labeling any wiring for lights or speakers in the cases.",
                "Luggage blocks access to the rear suspension, wiring and frame.", "Luggage off and stored; wiring labeled.",
                ["Unlock and remove each case.", "Label any wiring connectors to the cases.", "Store cases upright on a soft surface."], ["D-001"]),
               ("F-006", "Test the accessories and comfort features", "electrical", "Medium", 1.0, "Multimeter",
                "Test the accessories: radio and speakers, heated grips and seats, cruise control, power sockets, aux lights and any electric screen.",
                "Touring accessories add load and connectors, and failed ones often drain the battery.", "Each accessory works or is logged; no parasitic drain.",
                ["Work through each accessory and note what doesn't work.", "Check for battery drain with the key off.", "Look for poor owner-installed wiring and fuse every accessory circuit."], ["F-003"])],
        drop=[], sched=[("Coolant replace", "Cooling", 0, 24)], parts=[("Cosmetics", "finish", "Fairing panels"), ("Cosmetics", "finish", "Side cases and top box"), ("Electrical", "electrical", "Accessories and comfort features")],
        guide=("touring", "Restoring a touring bike", "Shaft drives, fairings, luggage and accessories.", [
            ["Drive", "Many touring bikes use a shaft; others use a belt or chain. The course follows the final drive you picked when you added the bike."],
            ["Brakes", "Many touring bikes have linked brakes or ABS with a specific bleeding order. Follow the manual exactly."],
            ["Accessories", "Touring bikes collect owner-added accessories. Check every one for good wiring and its own fuse."],
            ["Weight", "These are heavy bikes. A lift, the center stand and a helper make the work safer."]]),
        sugg=[["Follow the manual's brake bleeding order", "Linked and ABS brakes need it."], ["Fuse every accessory", "Owner-added accessories are the most common cause of electrical fires."]]),
    "cafe": dict(name="Cafe racer / classic", noun="classic", drive="chain",
        intro="A cafe racer or classic: usually older, often carbureted, with spoked wheels, chrome and simple electrics.",
        focus=[("Carburetors", "Rebuild and sync"), ("Points or early electronic ignition", "Gap and timing"), ("Spoked wheels", "Spokes and chrome rims"),
               ("Drum or early disc brakes", "Shoes and calipers"), ("Old wiring", "Often worth replacing")],
        strip=dict(about="Remove the seat, side covers, fuel tank, headlight and any fairing, and on a full restoration, the engine. Older bikes often have seized fasteners, so soak them in penetrating oil first. Bag and label everything.",
                   tips=["Soak old fasteners in penetrating oil the day before.", "Use proper JIS screwdrivers on Japanese screws to avoid stripping them.", "Photograph the wiring in the headlight shell before unplugging anything."]),
        finish=dict(title="Paint, chrome & period details", short="Tank and tins, frame, chrome and plating, and period-correct details.",
                    about="Refinish the tank, side covers and frame, restore or replate the chrome and spoked rims, and decide what stays original and what gets the cafe treatment.",
                    why="On a classic, the finish is what people see first, and correct paint and plating protect the metal for decades.",
                    tips=["Photograph the original stripes and badges before stripping.", "Decide original or custom before you buy parts.", "Plating shops take weeks. Send parts early."]),
        finish_tasks=[("M-002", "Refinish the tank, tins and frame", "finish", "Medium", 12.0, "Primer, paint, 2K clear, powder coat, or a shop",
                       "Strip and refinish the tank and side covers, and powder coat or paint the frame and swingarm while they're bare.",
                       "A bare frame is the one chance to get it right, and tank paint needs to be fuel-proof.", "Tank, tins and frame refinished and cured.",
                       ["Make the tank safe first: drained, rinsed and vapor-free.", "Strip, repair, prime, color and fuel-proof clear on the tank.", "Mask bearing races and threads before powder coating the frame.", "Check the frame for cracks before any coating."], ["M-001", "G-002", "E-002"]),
                      ("M-003", "Restore the chrome and spoked rims", "finish", "Medium", 6.0, "Chrome polish, plating shop, wheel builder",
                       "Polish sound chrome, replate pitted parts, and have the rims and spokes replated, replaced or rebuilt by a wheel builder.",
                       "Pitted chrome rusts through, and rusty spokes weaken the wheel.", "Chrome sound and bright; wheels laced and trued.",
                       ["Polish chrome with light rust.", "Send pitted parts to a plating shop or buy replacements.", "Have a wheel builder unlace, replate or replace and true the wheels."], ["M-001"]),
                      ("M-004", "Decide original or cafe, and fit the details", "finish", "Low", 3.0, "",
                       "Decide which parts stay original and which get the cafe treatment (bars, seat, mirrors, lights), and fit them.",
                       "Mixing original and custom without a plan looks unfinished and costs more.", "Decision recorded; details fitted.",
                       ["Record the decision in Problems & decisions.", "Check new bars still clear the tank at full lock and that cables and wiring reach.", "Keep the original parts if you remove them; they add value."], ["M-001"])],
        extra=[("F-006", "Consider replacing the wiring harness", "electrical", "High", 4.0, "Wiring diagram, crimp tools, or a new harness",
                "On an old bike with brittle, hacked or corroded wiring, decide whether to repair or replace the harness, and do it.",
                "Decades-old wiring is the most common cause of breakdowns and electrical fires on classics.", "Harness repaired or replaced; every circuit tested.",
                ["Count the cut, taped or corroded wires. Many means replace.", "Reproduction harnesses exist for many classics.", "Fit a modern regulator/rectifier if the original is failing."], ["F-003"])],
        drop=[], sched=[("Points gap and ignition timing", "Electrical", 3000, 12)],
        parts=[("Cosmetics", "finish", "Tank and side cover paint"), ("Cosmetics", "finish", "Chrome and plated parts"), ("Wheels", "chassis", "Spokes and rims")],
        guide=("cafe", "Restoring a classic or cafe racer", "Carbs, points, spokes, chrome and old wiring.", [
            ["Expect seized fasteners", "Soak them in penetrating oil the day before, and use JIS screwdrivers on Japanese screws."],
            ["Points ignition", "Many classics use points and a condenser. The gap and timing need setting with the manual's procedure; electronic ignition kits are a popular upgrade."],
            ["Wiring", "Old wiring is brittle and often hacked. A new harness is often less work than chasing faults."],
            ["Original or cafe", "Decide early. Original bikes hold value; cafe builds are about the look. Keep any original parts you take off."]]),
        sugg=[["Soak old fasteners first", "Penetrating oil the night before saves stripped bolts."], ["Keep the original parts", "Even on a cafe build, original parts add value later."]]),
    "scooter": dict(name="Scooter", noun="scooter", drive="cvt",
        intro="A scooter: automatic CVT, small wheels, body panels that cover everything, and often under-seat storage.",
        focus=[("Body panels", "Many clips and screws"), ("Small wheels", "Tire age and pressures"),
               ("Final gear oil", "Easy to forget"), ("Vacuum fuel petcock", "Common failure"), ("Under-seat storage", "Battery and wiring")],
        strip=dict(about="Remove the seat and storage bin, floorboards, front and side body panels, and any covers needed to reach the engine and wiring. Scooter panels interlock with hidden clips, so follow the manual's order. Bag and label every screw and clip.",
                   tips=["Scooter panels interlock. Find every screw before you pull.", "Expect some broken clips; order a clip kit.", "Photograph the wiring and hoses under the panels."]),
        finish=dict(title="Body panels & finish", short="Panel repair and paint, clips, floorboards and seat.",
                    about="Repair cracked panels and broken mounting tabs, replace missing clips, refinish the panels, and refresh the seat and floorboard mats.",
                    why="On a scooter, the panels are the whole look, and broken tabs make them rattle and crack further.",
                    tips=["A full clip and screw kit saves hunting for missing ones.", "Use plastic primer and adhesion promoter on panels.", "Floor mats wear out first and are cheap to replace."]),
        finish_tasks=[("M-002", "Repair the body panels and clips", "finish", "Low", 3.0, "Plastic welder, clip kit",
                       "Repair cracked panels and broken tabs, and replace missing clips and screws.",
                       "Broken tabs rattle and crack further.", "Every panel fits snugly with all its clips and screws.",
                       ["Repair cracks and tabs from behind.", "Replace every missing clip and screw.", "Test-fit each panel before painting."], ["M-001"]),
                      ("M-003", "Refinish the panels and refresh the seat", "finish", "Medium", 6.0, "Plastic primer, paint, clear",
                       "Paint the panels with a plastic primer system, and repair or recover the seat and replace the floor mats.",
                       "Fresh panels and seat transform how a scooter looks.", "Panels painted; seat sound; mats new.",
                       ["Scuff, clean and use adhesion promoter.", "Prime with a flexible primer, then color and clear.", "Recover or repair the seat; replace worn floor mats."], ["M-002"])],
        extra=[("G-008", "Test the vacuum fuel petcock", "fuel", "High", 0.5, "Hand vacuum pump",
                "Check the vacuum petcock opens only with vacuum and seals with the engine off, and replace its vacuum hose.",
                "A leaking vacuum petcock can flood the engine; a stuck one starves it.", "Petcock flows with vacuum and seals without; hose new.",
                ["Disconnect the fuel outlet into a container.", "Apply vacuum with a hand pump: fuel should flow.", "Release it: fuel should stop.", "Replace the vacuum hose."], ["G-003"])],
        drop=["H-005"], sched=[("Coolant replace (liquid-cooled only)", "Cooling", 0, 24)],
        parts=[("Cosmetics", "finish", "Body panels and clips"), ("Cosmetics", "finish", "Floorboards and mats"), ("Fuel", "fuel", "Vacuum petcock")],
        guide=("scooter", "Restoring a scooter", "CVT, panels, small wheels and the vacuum petcock.", [
            ["CVT", "There's no clutch lever or gears. A belt runs between two pulleys that change size. The belt and rollers wear and need replacing."],
            ["Panels", "Everything is behind panels. Taking them off carefully, in the manual's order, is half the job."],
            ["Small wheels", "Small tires work hard. Check age and pressures often."],
            ["Two-stroke or four-stroke", "Older scooters may be two-strokes with oil injection. Check the oil tank, pump and lines; never run one dry."]]),
        sugg=[["Order a clip kit", "Scooter panels lose clips every time they come off."], ["Check for two-stroke oil injection", "Older two-stroke scooters need the oil tank and pump working."]]),
}


def course_for(style):
    """The core course for this kind of bike, without the final drive (that's added per bike)."""
    st = STYLES[style]
    lessons = copy.deepcopy(LESSONS)
    lessons["I"].update(DRIVES[st["drive"]]["lesson"])
    lessons["D"].update(st["strip"])
    f = st["finish"]
    lessons["M"].update(title=f["title"], short=f["short"], about=f["about"], why=f["why"], tips=f["tips"])
    tasks = {k: v for k, v in T.items()}
    for t in st["finish_tasks"] + st["extra"]:
        tasks[t[0]] = t
    for d in st["drop"]:
        tasks.pop(d, None)
    return lessons, tasks


MOD_SUB = {"general": "Project", "engine": "Engine", "fuel": "Fuel & air", "electrical": "Electrical", "chassis": "Chassis", "finish": "Bodywork"}


def task_rec(row, i, have):
    tid, title, mod, safety, hrs, tools, ins, why, exp, ht, pre = row
    return stamp({"id": tid, "title": title, "instructions": ins, "reason": why, "phase": tid[0], "subsystem": MOD_SUB[mod], "module": mod,
                  "priority": "High" if safety in ("Critical", "High") else "Normal", "safety": safety, "skill": "Intermediate" if hrs >= 1.5 else "Basic",
                  "assignee": "", "estHours": hrs, "estCost": 0, "start": "", "due": "", "status": "Not started", "prereqs": [p for p in pre if p in have], "partIds": [],
                  "tools": tools, "supplies": "", "expected": exp, "inspectionCriteria": exp, "manualRef": VERIFY, "reviewer": "", "approval": "Pending",
                  "completedAt": "", "notes": "", "order": i, "comments": []})


def part_rec(i, cat, mod, name):
    return stamp({"id": f"INV-{i:04d}", "name": name, "oemPn": "", "pnVerified": False, "category": cat, "subsystem": cat, "module": mod, "parent": "",
                  "qtyExpected": 1, "qtyFound": 1, "qtyServiceable": 0, "qtyDamaged": 0, "qtyMissing": 0, "condition": "Uninspected", "status": "Not started",
                  "workRequired": "", "cleaning": "Not required", "replacement": "Unknown", "classification": "Unknown", "location": "On the bike", "bin": "",
                  "assignee": "", "priority": "Normal", "estCost": 0, "disposition": "Undecided", "notes": ""})


def insp_rec(i, partid, p, pt, u, tool, sc):
    return stamp({"id": f"INS-{i:04d}", "partId": partid, "component": p, "point": pt, "procedure": "Follow the factory service manual procedure for this check.", "spec": VERIFY,
                  "min": "", "max": "", "actual": "", "units": u, "tool": tool, "technician": "", "date": "", "result": "Pending", "corrective": "", "reinspection": "",
                  "reviewer": "", "manualRef": VERIFY, "evidence": "", "safetyCritical": sc, "notes": ""})


def check_rec(i, s_, c, crit, link, cr):
    return stamp({"id": f"SAFE-{i:03d}", "system": s_, "check": c, "criteria": cr, "criticality": crit, "links": link, "result": "Pending", "evidence": "", "inspector": "",
                  "reviewer": "", "date": "", "corrective": "", "reinspection": "", "notes": ""})


def sched_rec(i, n, c, mi, mo):
    return stamp({"id": f"SVC-{i:03d}", "name": n, "category": c, "everyMiles": mi, "everyMonths": mo, "lastDate": "", "lastMiles": 0, "source": TYPICAL, "notes": "", "order": i})


def tool_rec(i, n, c, u):
    return stamp({"id": f"TOOL-{i:03d}", "name": n, "category": c, "qty": "1", "available": "Unknown", "cost": 0, "location": "", "assignee": "", "usage": u, "safety": "",
                  "calibration": "", "status": "Planning", "notes": ""})


def pur_rec(i, d, partid, tk, stt, q):
    return stamp({"id": f"PUR-{i:04d}", "partId": partid, "taskId": tk, "description": d, "oemPn": "", "sourceType": stt, "qty": q, "supplier": "", "url": "", "unitPrice": 0,
                  "shipping": 0, "tax": 0, "fees": 0, "quoteDate": "", "orderDate": "", "expected": "", "delivered": "", "status": "Research", "tracking": "", "returnBy": "",
                  "warranty": "", "fitment": "Pending", "fitmentSource": "", "qc": "Pending", "receipt": "", "buyer": "", "notes": ""})


STEP_MODS = ["engine", "fuel", "electrical", "chassis"]


def steps_for(tasks, lessons):
    steps = []
    for mod in STEP_MODS:
        for nn, t in enumerate([t for t in tasks if t["module"] == mod], 1):
            steps.append(stamp({"id": f"{mod[:3].upper()}-{nn:03d}", "module": mod, "seq": nn, "workPackage": lessons[t["phase"]]["title"], "title": t["title"],
                                "procedure": t["instructions"], "prereqs": ";".join(t["prereqs"]), "tools": t["tools"], "materials": "", "evidence": "Photos and notes",
                                "acceptance": t["expected"], "estHours": t["estHours"], "owner": "", "status": "Not started", "result": "Pending", "reviewer": "",
                                "manualRef": VERIFY, "taskId": t["id"], "notes": ""}))
    return steps


def build(style):
    """baseline.json holds the course without its final drive, plus one bundle per final drive in `drives`.
    The app adds the bundle for the drive the rider picked when the project is first set up."""
    st = STYLES[style]
    lessons, core = course_for(style)
    drives = ["cvt"] if style == "scooter" else ["chain", "belt", "shaft"]
    order = lambda k: (k[0], int(k.split("-")[1]))
    core_ids = sorted(core, key=order)
    all_ids = set(core_ids) | {"I-001", "I-002", "I-003"}
    tasks = [task_rec(core[t], i, all_ids) for i, t in enumerate(core_ids)]
    howto = {t[0]: t[9] for t in core.values()}
    phases = [stamp({"id": k, "name": L["title"], "order": i, "start": "", "finish": "", "approval": "Not started", "approvedBy": "", "notes": ""}) for i, (k, L) in enumerate(lessons.items())]

    P = BASE_PARTS + st["parts"]
    if style == "scooter":
        P = [p for p in P if p[2] != "Clutch and clutch control"]
    parts = [part_rec(i, *p) for i, p in enumerate(P, 1)]
    pid = {p["name"]: p["id"] for p in parts}
    I = [x for x in BASE_INSP if x[0] in pid]
    inspections = [insp_rec(i, pid[x[0]], *x) for i, x in enumerate(I, 1)]
    checks = [check_rec(i, s_, c, crit, link if link in all_ids else "", cr) for i, (s_, c, crit, link, cr) in enumerate(BASE_CHECKS, 1)]
    gates = []
    for i, (nm, pre, cr) in enumerate(BASE_GATES, 1):
        gates.append(stamp({"id": f"GATE-{i:02d}", "name": nm, "criteria": cr, "prereqs": ";".join(p for p in pre.split(";") if p in all_ids), "status": "Not started", "result": "", "reviewer": "", "date": "", "corrective": "",
                            "evidence": "", "blocks": True, "required": True, "notes": ""}))
    S = BASE_SCHED + st["sched"]
    if style == "scooter":
        S = [x for x in S if "Control cables" not in x[0]] + [("Throttle and brake cables lube", "Controls & cables", 3000, 12)]
    schedule = [sched_rec(i, *x) for i, x in enumerate(S, 1)]
    tools = [tool_rec(i, *x) for i, x in enumerate(BASE_TOOLS, 1)]
    purchases = [pur_rec(i, d, pid.get(p, ""), tk if tk in all_ids else "", stt, q) for i, (d, p, tk, stt, q) in enumerate(BASE_PUR, 1)]
    steps = steps_for(tasks, lessons)

    bundles, drive_content = {}, {}
    for dk in drives:
        D = DRIVES[dk]
        dl = copy.deepcopy(lessons); dl["I"].update(D["lesson"])
        dtasks = [task_rec(t, 100 + i, all_ids) for i, t in enumerate(D["tasks"])]
        dparts = [part_rec(len(parts) + i, *x) for i, x in enumerate(D["parts"], 1)]
        dpid = dict(pid, **{p["name"]: p["id"] for p in dparts})
        dinsp = [insp_rec(len(inspections) + i, dpid[x[0]], *x) for i, x in enumerate(D["insp"], 1)]
        s_, c, crit, link, cr = D["check"]
        # procedure steps are numbered per area, so the bundle carries the full renumbered set
        allt = sorted(tasks + dtasks, key=lambda t: order(t["id"]))
        bundles[dk] = {"tasks": dtasks, "parts": dparts, "inspections": dinsp, "checks": [check_rec(len(checks) + 1, s_, c, crit, link, cr)],
                       "schedule": [sched_rec(len(schedule) + i, *x) for i, x in enumerate(D["sched"], 1)],
                       "tools": [tool_rec(len(tools) + i, *x) for i, x in enumerate(D["tools"], 1)],
                       "purchases": [pur_rec(len(purchases) + 1, D["purchase"][0], dpid.get(D["purchase"][1], ""), D["purchase"][2], "OEM / Aftermarket", 1)],
                       "steps": steps_for(allt, dl)}
        drive_content[dk] = {"lesson": D["lesson"], "howto": {t[0]: t[9] for t in D["tasks"]}, "tile": D["tile"]}
    sources = [stamp({"id": "SRC-001", "title": "NHTSA recall lookup", "publisher": "NHTSA", "url": "https://www.nhtsa.gov/recalls", "applies": "1981 and newer, 17-digit VIN", "subject": "Recalls", "verification": "Official", "notes": ""}),
               stamp({"id": "SRC-002", "title": "Factory parts diagrams (pick your bike)", "publisher": "RevZilla", "url": "https://www.revzilla.com/oem", "applies": "Most bikes from the 1980s on", "subject": "Parts diagrams and numbers", "verification": "Parts fiche, not a service manual", "notes": ""}),
               stamp({"id": "SRC-003", "title": "Factory service manual for your bike", "publisher": "", "url": "", "applies": "Your model and year", "subject": "Every spec in this course", "verification": "Add the manual you use here", "notes": ""})]
    docs = [stamp({"id": f"DOC-{i:04d}", "title": t, "kind": k, "taskId": tk, "partId": "", "inspectionId": "", "purchaseId": "", "folder": "", "caption": "", "tags": "", "date": "",
                   "link": "", "file": "", "fileName": "", "planned": True, "notes": ""}) for i, (t, k, tk) in enumerate([
        ("Before photos, all sides", "Before photo", "B-001"), ("VIN and engine number (keep private)", "Before photo", "A-001"), ("Wiring and cable routing", "Before photo", "B-001"),
        ("After photos, all sides", "After photo", "N-004"), ("Receipts", "Receipt", "N-005")], 1)]
    baseline = {"phases": phases, "parts": parts, "tasks": tasks, "steps": steps, "finishes": [], "inspections": inspections, "purchases": purchases, "expenses": [],
                "gates": gates, "checks": checks, "issues": [], "decisions": [], "maintenance": [], "schedule": schedule, "tools": tools, "docs": docs,
                "sources": sources, "team": [], "worklogs": [], "drives": bundles}

    gkey, gt, gsum, gbody = st["guide"]
    guides = copy.deepcopy(BASE_GUIDES)
    guides[gkey] = {"title": gt, "img": None, "cover": "{sil}", "icon": "book", "sum": gsum, "body": gbody}
    content = {
        "lessons": lessons, "howto": howto, "drives": drive_content,
        "sections": {"fuel": {"t": "Fuel system", "d": "Tank, carbs or injection"}, "finish": {"t": "Cleaning & finish", "d": "Cleaning, paint, bodywork"},
                     "chassis": {"t": "Wheels, brakes & suspension", "d": "Tires, brakes, forks, shocks"}},
        "moduleIntro": {"engine": "Compression, oil, plugs, valves, cooling, clutch and leaks. Every number comes from the factory service manual.",
                        "fuel": "Tank, petcock or pump, lines and filters, carbs or injection, air filter and sync.",
                        "electrical": "Battery, charging, grounds, starter, ignition, lights and switches.",
                        "chassis": "Frame, final drive, wheels and tires, brakes, forks, steering bearings and shocks. Most items here are safety-critical.",
                        "finish": "Cleaning, stripping down, rust, paint and finish, and reassembly. Label every fastener."},
        "guide": {"fuel": {"title": "Fuel system", "sub": "Tank, lines and filters, carbs or injection, air filter and sync.", "how": ["Mark the carb or injection steps that don't apply as Cancelled.", "Work on one carb at a time.", "Leak-test before the first start."]},
                  "engine": {"title": "Engine & cooling", "sub": "Compression, oil, plugs, valves, cooling and clutch.", "how": ["Work the procedure top to bottom and tick each step as you go.", "Measurements and torque values come from the factory manual.", "Do the compression test before spending on the engine."]},
                  "chassis": {"title": "Wheels, brakes & suspension", "sub": "Final drive, tires, brakes, forks, steering and shocks.", "how": ["Most items here are safety-critical and need a second person to check.", "Check tire date codes, not just tread.", "Bleed brakes exactly as the manual describes."]},
                  "finish": {"title": "Cleaning & finish", "sub": "Stripping, cleaning, rust, paint and bodywork.", "how": ["Bag and label every fastener with where it came from.", "Mask bearing seats, threads and gasket faces.", "Record products and cure times."]},
                  "diagrams": {"title": "Parts diagrams", "sub": "Factory parts diagrams for the {bike}. Pick your make, year and model on the site."},
                  "shops": {"sub": "Places to find parts, diagrams and help for the {bike}. Prices change, so the app never guesses them.", "how": ["Start with the factory parts diagrams to get the right part number.", "Compare prices across shops, including shipping.", "Every part's detail panel also has its own links."]},
                  "course": {"title": "The course", "sub": f"Fourteen parts that take a tired {st['noun']} to fully sorted, in the order the work usually happens. Mark any step that doesn't apply to your bike as Cancelled."},
                  "home": {"how": ["Follow the course from Part 1 to Part 14. Skip steps that don't apply to your bike.", "Tick steps off as you finish them. Progress updates everywhere.", "Set up the Maintenance log at the end so you always know what's due."]}},
        "shops": BASE_SHOPS, "catShops": BASE_CATSHOPS, "guides": guides, "suggestions": st["sugg"] + BASE_SUGG,
    }
    bike = {"id": f"restore-{style}", "year": "", "make": "", "model": "", "short": "bike", "name": f"Any {st['noun']}", "variant": f"Restoration course for any {st['noun']}",
            "universal": True, "style": style, "status": "universal", "specs": [], "links": {"ebay": "motorcycle"}, "hero": None, "extras": {},
            "styleName": st["name"], "styleIntro": st["intro"], "styleFocus": st["focus"], "drive": st["drive"], "drives": drives, "specNote": ""}
    out = ROOT / "data" / "packs" / f"restore-{style}"
    out.mkdir(parents=True, exist_ok=True)
    (out / "bike.json").write_text(json.dumps(bike, indent=1, ensure_ascii=False))
    (out / "baseline.json").write_text(json.dumps(baseline, indent=1, ensure_ascii=False))
    (out / "content.json").write_text(json.dumps(content, indent=1, ensure_ascii=False))
    return len(tasks), {k: len(v["tasks"]) for k, v in bundles.items()}, len(parts), len(schedule)


if __name__ == "__main__":
    for s in STYLES:
        print(s, *build(s))
