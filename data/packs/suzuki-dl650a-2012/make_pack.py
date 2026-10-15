"""Builds content.json and baseline.json for the 2012 Suzuki V-Strom 650 ABS (DL650A).

Facts come from the sources listed in SOURCES below. Torque values, clearances and other
numbers that only the factory service manual gives are left as VERIFY on purpose.
Run: python3 make_pack.py
"""
import json, pathlib

HERE = pathlib.Path(__file__).parent
TS = "2026-10-15T00:00:00Z"
VERIFY = "VERIFY IN FACTORY SERVICE MANUAL"
SCHED_SRC = "Owner's manual table as copied by maintenanceschedule.com (third-party). Check your owner's manual."


def stamp(r):
    r.update({"createdAt": TS, "updatedAt": TS, "updatedBy": "Revora starter project", "archived": False})
    return r


# ---------------------------------------------------------------- course
LESSONS = {
    "A": dict(title="Get set up", icon="book", short="Confirm which V-Strom you have, check for open recalls, and set up your space and budget.",
              about="Confirm the exact model from the VIN, look up open recalls, get the service manual, set up a clean place to work and set a budget.",
              why="The 2012 bike had three recalls. Knowing what's been done and what hasn't changes what you need to buy and what the dealer should do for free.",
              tips=["Run the VIN through the NHTSA recall lookup before you spend anything.", "Keep the full VIN out of photos you post online.", "The ABS and the ABS Adventure are the same bike underneath. The Adventure adds side cases, engine bars and an adjustable screen."],
              shops=["nhtsa", "manuals", "stromtrooper"]),
    "B": dict(title="Inspect it as it sits", icon="eye", short="Record the mileage, check fluids and leaks, and take a short test ride if it's safe.",
              about="Before taking anything apart, record the odometer, look for leaks and damage, check every fluid, start it and, if it's safe, ride it gently around the block.",
              why="A bike that runs tells you a lot. Noises, warning lights and how it shifts point you at the jobs that matter.",
              tips=["Start it cold if you can. Hard starting and a rattle at start-up are easier to hear cold.", "Watch the ABS light: it should go out once you're moving.", "Write down every warning light, noise and leak, even small ones."],
              shops=["stromtrooper"]),
    "C": dict(title="Research, budget & order", icon="cart", short="Turn what you found into a parts list, check part numbers on the fiche, and order.",
              about="Use the inspection notes to build the parts and fluids list, look up part numbers on the factory parts diagrams, price it all and order.",
              why="Ordering once, with the right part numbers, saves weeks of waiting and return shipping.",
              tips=["Order the service parts together: oil filter, air filter, spark plugs, brake pads, fluids.", "The 2012 bike uses two spark plugs per cylinder, so four plugs total.", "Compare the delivered price, not just the sticker price."],
              shops=["fiche", "revzilla", "denniskirk"]),
    "D": dict(title="Take off the bodywork", icon="layers", short="Remove the seat, side covers, fairing panels and tank covers, and keep every fastener labeled.",
              about="Remove the seat, side covers, fairing panels and tank covers so you can reach the engine, wiring and cooling system. Bag and label every screw with where it came from.",
              why="Modern bodywork uses many screw lengths and plastic clips. Labeled bags mean no cracked panels or stripped mounts at reassembly.",
              tips=["Photograph each panel before and after you remove it.", "Plastic tabs break when cold. Work in a warm garage.", "Lay panels on a towel, painted side up."],
              shops=["fiche", "ebay"]),
    "E": dict(title="Clean & inspect", icon="spray", short="Wash and degrease, then look closely at the frame, subframe, wiring and connectors.",
              about="With the bodywork off, clean the bike and inspect the frame, subframe, swingarm pivot, wiring and connectors for damage, rub marks and corrosion.",
              why="Dirt hides cracks, leaks and chafed wires. This is the cheapest time to find them.",
              tips=["Cover the air intake, exhaust outlets and electrical connectors before washing.", "Don't point a pressure washer at bearings, seals or connectors.", "Look for wiring that rubs on the frame near the steering head."],
              shops=["revzilla"]),
    "F": dict(title="Charging & electrical", icon="bolt", short="Test the battery and charging system, check the stator connector and grounds, then lights and switches.",
              about="Test the battery, measure charging output, inspect the stator and regulator/rectifier connectors and the main grounds, then test every light, switch and warning lamp.",
              why="The 2012 to 2016 bikes had a recall for stators that could overheat and short. A weak charging system leaves you stranded, so it's worth testing properly.",
              tips=["Test charging with a multimeter at the battery with the engine running, using the manual's procedure and numbers.", "A brown, melted or loose connector between stator and regulator is a red flag.", "Check that the brake light works from both the front lever and the rear pedal."],
              shops=["ricks", "fiche", "stromtrooper"]),
    "G": dict(title="Cooling system", icon="gauge", short="Replace the coolant, check the radiator, hoses, cap and fan.",
              about="Drain and refill the coolant with the type the manual specifies, inspect the radiator for damage and blocked fins, check the hoses and clamps, and confirm the fan switches on.",
              why="The schedule calls for new coolant and radiator hoses every four years. Old coolant corrodes from the inside and old hoses split under pressure.",
              tips=["Only open the cap on a cold engine.", "Bleed air out of the system as the manual describes, then recheck the level after a ride.", "Straighten bent radiator fins gently with a plastic tool."],
              shops=["fiche", "revzilla"]),
    "H": dict(title="Fuel & air", icon="fuel", short="Air filter, fuel lines, throttle bodies and cable, then a throttle-body sync.",
              about="Replace or clean the air filter, inspect the fuel lines and clamps, clean the throttle bodies, set the throttle cable play and synchronize the two throttle bodies.",
              why="A dirty filter and out-of-sync throttle bodies make the bike lumpy at low speed and waste fuel.",
              tips=["Plug the intake openings whenever the airbox is off.", "Throttle-body sync needs a two-gauge vacuum tool and the manual's procedure.", "Fuel lines are on a four-year replace schedule even if they look fine."],
              shops=["fiche", "revzilla", "denniskirk"]),
    "I": dict(title="Engine service", icon="engine", short="Oil and filter, spark plugs, clutch cable, and a valve clearance check when it's due.",
              about="Change the oil and filter, replace the four spark plugs, set clutch cable play and, if the bike is at or past the interval, check the valve clearances.",
              why="These are the jobs that keep the engine healthy. 2012 to 2014 bikes also had a recall for camshaft and tappet wear, so the valve check matters.",
              tips=["Warm the engine before draining so the oil flows.", "The rear cylinder plugs are harder to reach. Take your time and don't cross-thread them.", "Valve clearance is measured cold, with the manual's procedure and limits."],
              shops=["fiche", "revzilla", "stromtrooper"]),
    "J": dict(title="Wheels, tires & chain", icon="wheel", short="Tire age and wear, wheel bearings, chain and sprockets, and the rear cush drive.",
              about="Check tire age, tread and damage, wheel bearings and wheel runout, the chain and sprockets for wear, and the rubber cush drive in the rear hub.",
              why="Tires and the chain wear out on every bike, and both are safety items. Old tires can look fine and still be hard and slippery.",
              tips=["Read the four-digit date code on each tire: week then year.", "Tire sizes are 110/80R19 front and 150/70R17 rear.", "Replace chain and both sprockets together."],
              shops=["revzilla", "denniskirk", "allballs"]),
    "K": dict(title="Brakes & ABS", icon="shield", short="Pads, discs, calipers, fresh fluid, hoses, and a check that the ABS works.",
              about="Inspect pads and discs, clean the calipers and pistons, replace the brake fluid, inspect the hoses and confirm the ABS warning light behaves normally.",
              why="Brake fluid is on a two-year replace schedule. With ABS, bleeding has to follow the manual's procedure so no air gets trapped in the ABS unit.",
              tips=["Never let a reservoir run dry while bleeding.", "Use only the fluid type printed on the reservoir cap.", "Brake fluid strips paint. Cover the tank and fairing."],
              shops=["fiche", "revzilla", "denniskirk"]),
    "L": dict(title="Suspension & steering", icon="wrench", short="Fork oil and seals, steering head bearings, rear shock and linkage, then set the sag.",
              about="Check the forks for leaks and replace the oil and seals if needed, check and adjust the steering head bearings, inspect the rear shock and grease the linkage, then set preload and rebound.",
              why="Worn steering bearings and tired fork oil make the bike wander and dive. Setting sag for your weight makes a big difference on this bike.",
              tips=["Support the bike securely with the front wheel off the ground before checking steering bearings.", "Fork oil type and level come from the manual.", "Write down your preload and rebound settings before changing them."],
              shops=["allballs", "revzilla", "stromtrooper"]),
    "M": dict(title="Reassemble & road test", icon="check", short="Refit the bodywork, check every fastener, then a careful test ride and a recheck.",
              about="Refit the tank covers, fairing, side covers and seat, torque-check the critical fasteners, confirm lights and controls, then do a careful test ride and look the bike over again.",
              why="The test ride is where loose bolts, air in the brakes and leaks show up, while it's still cheap to fix.",
              tips=["Start the ride slowly in a quiet area and test the brakes at walking speed.", "After the ride, look for leaks and recheck fluid levels.", "Have a second person check the safety items."],
              shops=["revzilla"]),
    "N": dict(title="Keep it running", icon="gauge", short="Set up the maintenance schedule, record what you did and back up the project.",
              about="Load the bike's service schedule into the Maintenance log, log the work you just did, add receipts and back up the project.",
              why="A full service history makes the next service easy and adds real value when you sell.",
              tips=["Log today's odometer reading in the Maintenance log.", "Mark the services you just did so their next due dates start counting.", "Keep receipts and part numbers with each service record."],
              shops=["manuals"]),
}
COVER = dict(A="tools", B="suzuki-dl650-2012", C="tools", D="suzuki-dl650-2012", E="tools", F="electrical", G="cooling", H="fuel", I="engine", J="wheels", K="brakes", L="suspension", M="suzuki-dl650-2012", N="tools")
for k, L in LESSONS.items():
    L.update(img=None, focus=None, cover=COVER[k])

# ---------------------------------------------------------------- steps of the course
# (id, title, module, safety, hours, tools, instructions, reason, expected, howto, prereqs)
T = []
def task(*a): T.append(a)

task("A-001", "Confirm which V-Strom you have", "general", "High", 0.5, "Flashlight, phone camera",
     "Read the VIN on the steering head and the frame label, check the model code and note whether it's the ABS or the ABS Adventure.",
     "The right manual and parts depend on the exact model.", "Model, year and VIN recorded in Settings.",
     ["Find the VIN stamped on the right side of the steering head and the label on the frame.", "Photograph both, then write the VIN in Settings (keep it out of public photos).", "Note if the bike has the Adventure's side cases, engine bars and adjustable screen."], [])
task("A-002", "Check for open recalls", "general", "Critical", 0.5, "Phone or computer",
     "Run the VIN through the NHTSA recall lookup and call a Suzuki dealer to confirm which recalls were done.",
     "2012 bikes were covered by recalls for the stator, camshafts/tappets and the front brake light switch.", "Every recall marked done or booked with a dealer.",
     ["Go to nhtsa.gov/recalls and enter the VIN.", "Write each open recall in Problems & decisions.", "Call a Suzuki dealer with the VIN to ask what's on record and book any open recall work, which is free."], ["A-001"])
task("A-003", "Get the service manual", "general", "High", 0.5, "",
     "Get the factory service manual for the 2012 DL650A and the owner's manual.",
     "Torque values, clearances and procedures in this course all come from the manual.", "Service manual on hand and listed under Reference sources.",
     ["Buy or download the factory service manual for the 2012 DL650A.", "Check the cover lists the DL650A and the 2012 model year.", "Add it to Reference sources so the team knows where it is."], ["A-001"])
task("A-004", "Set up the workspace", "general", "Medium", 1.5, "Rear stand, shelves, bins, labels",
     "Clear a workspace with good light, a rear stand or lift, bins for fasteners, and a safe spot for fluids.",
     "A tidy space means fewer lost bolts and fewer accidents.", "Bike on a stand; labeled bins and drain pans ready.",
     ["Put the bike on a rear stand on a level floor.", "Set up labeled bins or bags for fasteners.", "Keep a drain pan, rags and a fire extinguisher within reach."], [])
task("A-005", "Set the budget", "general", "Low", 0.5, "",
     "Set a budget in Settings with a cushion for surprises.",
     "Knowing the limit helps you decide between repair and replace.", "Budget and contingency set in Settings.",
     ["List the costs you already expect: service parts, tires, chain, brake parts.", "Add a cushion for surprises.", "Enter both in Settings."], [])

task("B-001", "Record the odometer and photograph the bike", "general", "Low", 0.5, "Phone camera",
     "Record the odometer, then photograph the bike from every side and close up on anything damaged.",
     "Before photos help at reassembly and record the condition you started with.", "Odometer logged; before photos uploaded.",
     ["Log the odometer reading in the Maintenance log.", "Take photos from both sides, front, back and above.", "Close-ups of scratches, cracks, leaks and modifications."], [])
task("B-002", "Check every fluid and look for leaks", "general", "High", 1.0, "Flashlight, rags",
     "Check engine oil, coolant, and front and rear brake fluid levels and condition, and look for leaks around the engine, radiator, forks and brakes.",
     "Low or dirty fluids and leaks point straight at the jobs you need to do.", "Each fluid level and condition recorded; leaks logged as problems.",
     ["Check oil in the sight window with the bike upright and level.", "Check the coolant reserve level and color.", "Check both brake fluid reservoirs: level and color (dark means old).", "Look under the engine, around the radiator, at the fork seals and at the calipers for leaks."], ["B-001"])
task("B-003", "Start it and listen", "engine", "High", 0.5, "",
     "Start the engine, watch the warning lights, and listen for rattles, ticking or rough running as it warms up.",
     "Noises and warning lights at start-up are early warnings of bigger problems.", "Start-up behavior and warning lights recorded.",
     ["Turn the key and watch which lights come on and go off.", "Start it and listen for a rattle at start-up or a steady ticking.", "Let it idle and watch the temperature reading and the fan."], ["B-002"])
task("B-004", "Short test ride, if it's safe", "chassis", "Critical", 0.5, "Helmet and gear",
     "If brakes, tires and steering pass a basic check, ride slowly around the block and note how it brakes, shifts and handles.",
     "A ride shows problems you can't find on the stand.", "Ride notes written, or ride skipped with the reason recorded.",
     ["Only ride if both brakes work, the tires hold air and the steering is free.", "Test brakes at walking speed first.", "Note clutch feel, shifting, any wobble and whether the ABS light goes out once moving."], ["B-002", "B-003"])
task("B-005", "Write the job list", "general", "Medium", 0.5, "",
     "Turn the inspection notes into a list of jobs, marking anything safety-related.",
     "A clear list keeps the project focused and drives the parts order.", "Problems logged with severity; job list agreed.",
     ["Add a problem for each issue you found.", "Mark brakes, tires, steering and leaks as high severity.", "Decide which course parts you'll do in full and which you'll skip."], ["B-004"])

task("C-001", "Look up part numbers on the fiche", "general", "Medium", 1.0, "",
     "Use the factory parts diagrams for the 2012 DL650A to find the part number for everything on the job list.",
     "The right part number is the only reliable way to order the right part.", "Part numbers entered on each part in Parts.",
     ["Open the parts diagrams for the area you need.", "Find the reference number on the drawing, then the part number in the list.", "Type the part number into that part's record here."], ["A-003", "B-005"])
task("C-002", "Price it and check the budget", "general", "Low", 0.5, "",
     "Price each part from at least two shops including shipping and compare the total with the budget.",
     "Delivered prices vary more than you'd expect.", "Shopping list priced; budget forecast checked.",
     ["Add each part to the Shopping list.", "Add two quotes where you can, with shipping.", "Check the Money page forecast against the budget."], ["C-001"])
task("C-003", "Order the parts", "general", "Low", 0.5, "",
     "Order the parts and fluids, recording order dates and tracking.",
     "Ordering everything at once avoids stopping halfway through a job.", "Every item ordered and tracked.",
     ["Order the service parts together.", "Record the order date and tracking on each item.", "Check each part against the part number when it arrives."], ["C-002"])

task("D-001", "Remove the seat and side covers", "finish", "Low", 0.5, "Ignition key, hex keys",
     "Remove the seat with the key, then the side covers, bagging and labeling each fastener.",
     "Access to the battery, fuses and wiring starts here.", "Seat and side covers off; fasteners bagged and labeled.",
     ["Unlock and lift off the seat.", "Remove the side cover screws and unclip the covers gently.", "Bag the screws and write which cover they came from."], ["A-004"])
task("D-002", "Remove the fairing and tank covers", "finish", "Low", 1.5, "Hex keys, plastic trim tool",
     "Remove the tank covers, fairing side panels and any panels needed to reach the radiator and wiring.",
     "The cooling system and front wiring sit behind these panels.", "Panels off without broken tabs; all fasteners labeled.",
     ["Follow the manual's order so panels come apart in the right sequence.", "Release clips with a plastic trim tool, not a screwdriver.", "Photograph each panel's screw locations before you bag them."], ["D-001"])
task("D-003", "Disconnect the battery", "electrical", "High", 0.2, "Hex key or screwdriver",
     "Disconnect the battery, negative first, and remove it for testing and charging.",
     "Working with the battery connected risks shorts and damage to the ECU and ABS unit.", "Battery out and on a smart charger.",
     ["Remove the negative cable first, then the positive.", "Lift the battery out and keep it upright.", "Put it on a smart charger or maintainer."], ["D-001"])

task("E-001", "Wash and degrease", "finish", "Low", 2.0, "Bucket, soft brushes, degreaser",
     "Clean the bike so you can see the frame, engine and wiring, protecting electrical parts and intakes.",
     "You can't inspect what you can't see.", "Bike clean; no water in connectors or intakes.",
     ["Cover the intake, exhaust outlets and exposed connectors.", "Use a degreaser safe for paint, plastic and aluminum.", "Rinse gently, then dry with air or a towel."], ["D-002"])
task("E-002", "Inspect the frame, subframe and swingarm", "chassis", "Critical", 1.0, "Flashlight",
     "Inspect the frame, subframe, footpeg mounts and swingarm for cracks, bends and crash damage.",
     "Crash damage on the frame or subframe makes the bike unsafe.", "Frame and subframe checked; any damage logged.",
     ["Look at welds, mounts and the steering head area for cracks.", "Check the subframe and luggage rack mounts for bends.", "Look for scrape marks that suggest the bike has been dropped."], ["E-001"])
task("E-003", "Inspect wiring and connectors", "electrical", "High", 1.0, "Flashlight, contact cleaner",
     "Look over the harness for rubbed insulation, melted spots and green corrosion in connectors.",
     "Chafed wires and corroded connectors cause intermittent faults that are hard to find later.", "Harness checked; damage logged.",
     ["Follow the harness from the headlight back to the tail.", "Look closely where it passes the steering head and frame edges.", "Open the main connectors and look for corrosion or melted plastic."], ["E-001"])

task("F-001", "Test and charge the battery", "electrical", "Medium", 0.5, "Multimeter, battery charger",
     "Fully charge the battery and test it under load or with a battery tester.",
     "Every other electrical test is meaningless with a weak battery.", "Battery passes or replacement ordered.",
     ["Charge it fully with a smart charger.", "Let it rest, then measure the voltage.", "Load-test it or have a shop test it. Replace it if it fails."], ["D-003"])
task("F-002", "Inspect the stator and regulator connectors", "electrical", "High", 0.5, "Flashlight",
     "Inspect the connector between the stator and the regulator/rectifier and the regulator's mounting and wiring.",
     "A burnt connector here is a common sign of charging trouble, and the stator is under recall on these bikes.", "Connector condition recorded with photos.",
     ["Find the regulator/rectifier and follow its wires to the stator connector.", "Unplug it and look for brown, melted or loose pins.", "Photograph it and log anything that isn't clean and tight."], ["D-002"])
task("F-003", "Test the charging system", "electrical", "High", 1.0, "Multimeter",
     "With a good battery fitted, measure charging voltage at the battery and test stator output using the manual's procedure.",
     "This confirms the stator and regulator are doing their job.", "Readings recorded and compared to the manual's figures.",
     ["Refit the charged battery.", "Follow the manual's charging test with the engine running at the stated speeds.", "Record each reading in Measurements and compare with the manual."], ["F-001", "F-002"])
task("F-004", "Check grounds, lights, switches and warning lamps", "electrical", "High", 1.0, "Multimeter",
     "Clean the main ground points, then test every light, the horn, switches and the warning lamps including ABS.",
     "Riders need to see and be seen. The brake light switch on 2012 bikes was under recall.", "Every light and switch works; brake light works from lever and pedal.",
     ["Clean and tighten the battery and frame ground points.", "Test headlight high and low, turn signals, tail and brake light from both the lever and the pedal.", "Check the horn, kill switch and side-stand switch.", "Confirm the ABS light comes on with the key and goes out once moving."], ["F-003"])

task("G-001", "Drain and refill the coolant", "engine", "High", 1.5, "Drain pan, funnel",
     "Drain the coolant on a cold engine, flush if needed, and refill with the type the manual specifies, bleeding out the air.",
     "The schedule calls for new coolant every four years.", "System full, bled, and the reserve at the right level.",
     ["Only open the system with the engine cold.", "Drain into a pan; coolant is poisonous to pets.", "Refill with the specified coolant and bleed air as the manual describes.", "Run it to temperature, let it cool, recheck the level."], ["D-002"])
task("G-002", "Inspect the radiator, hoses and cap", "engine", "Medium", 0.5, "Flashlight",
     "Check the radiator for leaks and blocked fins, and the hoses and clamps for cracks, swelling or seepage.",
     "Radiator hoses are on a four-year replace schedule.", "Radiator and hoses checked; replacements ordered if due.",
     ["Look through the radiator for bugs and dirt; rinse gently from behind.", "Squeeze each hose: replace any that are hard, soft or cracked.", "Check the hose clamps and the cap seal."], ["D-002"])
task("G-003", "Confirm the fan works", "electrical", "High", 0.5, "",
     "Let the engine reach temperature at idle and confirm the fan switches on and off.",
     "A dead fan means overheating in traffic.", "Fan switches on at temperature and off again.",
     ["Idle the engine with the bike in a ventilated area.", "Watch the temperature reading and listen for the fan.", "If it never comes on, check the fuse and connector before replacing parts."], ["G-001"])

task("H-001", "Replace or clean the air filter", "fuel", "Low", 0.5, "Hex keys",
     "Remove the air filter, inspect it, and replace it if it's due or dirty.",
     "A clogged filter costs power and fuel economy.", "Clean or new filter fitted; intake checked for debris.",
     ["Remove the tank or covers as the manual describes to reach the airbox.", "Lift out the filter and check for dirt, oil and damage.", "Fit a new one if it's due on the schedule or dirty."], ["D-002"])
task("H-002", "Inspect the fuel lines and clamps", "fuel", "High", 0.5, "Flashlight",
     "Inspect the fuel lines and clamps for cracks, hardening and seepage.",
     "Fuel lines are on a four-year replace schedule, and a fuel leak is a fire risk.", "Fuel lines checked; replaced if due.",
     ["Follow each fuel line from the tank to the throttle bodies.", "Bend gently and look for cracks or hardness.", "Replace any that fail or are past four years."], ["D-002"])
task("H-003", "Clean the throttle bodies and set cable play", "fuel", "Medium", 1.0, "Throttle body cleaner, rags",
     "Clean carbon from the throttle plates and set the throttle cable free play to the manual's figure.",
     "Sticky plates and wrong cable play cause a jerky throttle.", "Plates clean; cable play within spec; throttle snaps shut.",
     ["Remove the airbox to reach the throttle bodies.", "Clean the plates with throttle body cleaner on a rag, never forcing them.", "Set cable play with the adjuster and check the throttle snaps shut with the bars turned both ways."], ["H-001"])
task("H-004", "Synchronize the throttle bodies", "fuel", "Medium", 1.5, "Two-gauge vacuum sync tool",
     "Synchronize the two throttle bodies with a vacuum gauge set, following the manual's procedure.",
     "Out-of-sync throttle bodies make the bike lumpy at low speed.", "Both cylinders balanced per the manual.",
     ["Warm the engine fully.", "Connect the gauges to the vacuum ports the manual shows.", "Adjust with the balance screw until the readings match, then refit the caps."], ["H-003"])

task("I-001", "Change the oil and filter", "engine", "High", 1.0, "Drain pan, filter wrench, torque wrench",
     "Drain the warm oil, replace the filter and drain bolt washer, and refill with the oil the manual specifies.",
     "Fresh oil is the cheapest engine protection there is.", "New oil and filter; level correct in the window; no leaks.",
     ["Warm the engine, then shut it off.", "Remove the drain bolt and let it drain fully.", "Fit a new filter and drain washer, torqued to the manual's values.", "Refill, run briefly, then check the level in the window with the bike upright."], ["B-005"])
task("I-002", "Replace the spark plugs", "engine", "Medium", 1.5, "Plug socket, extension, torque wrench",
     "Replace all four spark plugs (two per cylinder) with the type the manual lists.",
     "The schedule replaces plugs at 7,500 miles.", "Four new plugs fitted to the correct torque.",
     ["Let the engine cool fully.", "Blow dirt away from each plug well before removing the plug.", "Start new plugs by hand to avoid cross-threading, then torque to spec."], ["D-002"])
task("I-003", "Set the clutch cable play", "engine", "Low", 0.3, "",
     "Set clutch cable free play at the lever with the adjuster.",
     "Too little play makes the clutch slip; too much makes shifting hard.", "Free play within the manual's range.",
     ["Measure the play at the lever tip.", "Adjust at the lever or the lower cable adjuster.", "Check the clutch fully disengages and the bike doesn't creep in gear."], [])
task("I-004", "Check the valve clearances (when due)", "engine", "High", 5.0, "Feeler gauges, manual",
     "If the bike is at or past the valve-check interval, or the cam recall applies, measure the valve clearances cold and adjust per the manual.",
     "The schedule calls for a check at 14,500 miles, and 2012 to 2014 bikes had a cam and tappet recall.", "Clearances recorded in Measurements and within spec.",
     ["Confirm with the dealer whether the cam recall was done.", "With the engine cold, remove the covers and set each cylinder as the manual describes.", "Measure every valve and record it.", "Adjust any out of spec using the manual's method."], ["A-002", "D-002"])

task("J-001", "Check tire age, tread and damage", "chassis", "Critical", 0.5, "Tread gauge, tire gauge",
     "Read the date code on both tires, measure the tread, look for cracks, plugs and flat spots, and set the pressure.",
     "Tires age out even with tread left.", "Both tires pass or replacements ordered.",
     ["Find the four-digit date code on each sidewall (week, then year).", "Measure the tread in the center and the edges.", "Look for cracks, cuts, plugs and squared-off wear.", "Set the pressures from the label on the bike or the owner's manual."], [])
task("J-002", "Check the wheel bearings", "chassis", "High", 0.5, "Stand",
     "With each wheel off the ground, check for play and rough rotation.",
     "Worn bearings make the bike wander and can fail.", "No play; smooth rotation.",
     ["Lift the wheel off the ground.", "Rock it side to side at the top and bottom; feel for play.", "Spin it and listen for grinding."], ["A-004"])
task("J-003", "Check the chain, sprockets and cush drive", "chassis", "High", 1.0, "Chain wear gauge or ruler",
     "Measure chain wear and slack, inspect sprocket teeth and check the rear cush drive rubbers.",
     "A worn chain can jump or break.", "Chain and sprockets pass or a kit is ordered; slack set to the manual's figure.",
     ["Clean the chain so you can see the rollers and O-rings.", "Measure wear over the length the manual gives.", "Look for hooked sprocket teeth.", "With the wheel out, check the cush rubbers for cracks and play."], ["J-002"])

task("K-001", "Inspect pads and discs", "chassis", "Critical", 0.5, "Flashlight, caliper gauge",
     "Check pad thickness and disc thickness, scoring and warping on both brakes.",
     "Worn pads and thin discs are a straight safety issue.", "Pads and discs within limits or replacements ordered.",
     ["Look at the pad wear indicators.", "Measure disc thickness and compare with the minimum stamped on the disc.", "Spin the wheel and watch for warping or rubbing."], [])
task("K-002", "Clean the calipers and fit pads", "chassis", "Critical", 1.5, "Brake cleaner, torque wrench",
     "Clean the calipers and pistons, check the pistons move freely, and fit new pads if needed.",
     "Sticky pistons cause dragging and uneven braking.", "Pistons move smoothly; pads fitted correctly.",
     ["Remove the caliper as the manual describes.", "Clean around the pistons and push them back evenly.", "Fit the pads and pins, then torque the caliper bolts to spec.", "Pump the lever before moving the bike."], ["K-001"])
task("K-003", "Replace the brake fluid (ABS)", "chassis", "Critical", 1.5, "Bleed kit, wrench, rags",
     "Replace the front and rear brake fluid with the type on the reservoir cap, following the manual's ABS procedure.",
     "The schedule replaces brake fluid every two years.", "Fresh fluid, firm lever and pedal, no leaks.",
     ["Cover painted parts; brake fluid strips paint.", "Bleed in the order the manual gives for the ABS system.", "Never let the reservoir run dry.", "Finish with firm lever and pedal and no leaks."], ["K-002"])
task("K-004", "Inspect the brake hoses", "chassis", "High", 0.3, "Flashlight",
     "Inspect the brake hoses for cracks, bulges and leaks.",
     "Brake hoses are on a four-year replace schedule.", "Hoses checked; replacements ordered if due.",
     ["Follow each hose from master cylinder to caliper.", "Look for cracks, bulges and wet spots.", "Have a helper squeeze the lever while you watch for bulging."], [])

task("L-001", "Check the forks", "chassis", "High", 1.0, "Rag, flashlight",
     "Look for oil on the fork tubes, pitting on the chrome, and check damping. Replace the oil and seals if they're leaking or due.",
     "Leaking seals let oil onto the brakes and worn oil makes the front dive.", "Forks dry and damping smooth, or service done.",
     ["Wipe the tubes and look for oil after a few compressions.", "Check the chrome for pits that would cut new seals.", "If serviced, use the oil type and level from the manual."], [])
task("L-002", "Check the steering head bearings", "chassis", "Critical", 0.5, "Stand",
     "With the front wheel off the ground, check for notchiness and play, and adjust or replace the bearings.",
     "Worn steering bearings make the bike weave and feel vague.", "Steering smooth with no play.",
     ["Lift the front wheel safely.", "Turn the bars slowly lock to lock; feel for notches.", "Grip the fork legs and push and pull to feel for play.", "Adjust or replace as the manual describes."], ["A-004"])
task("L-003", "Check the rear shock and linkage", "chassis", "High", 1.0, "Grease",
     "Check the shock for leaks, the linkage for play, and grease the linkage bearings.",
     "Dry linkage bearings wear fast and make the rear end clunk.", "Shock dry, linkage greased, no play.",
     ["Look for oil on the shock body.", "Lift the rear and check the linkage for play.", "Clean and grease the linkage bearings."], ["A-004"])
task("L-004", "Set the sag, preload and rebound", "chassis", "Medium", 1.0, "Tape measure, helper",
     "Measure sag with you on the bike and set rear preload and rebound for your weight and load.",
     "The right sag makes the bike handle the way it was designed.", "Settings recorded.",
     ["Measure the unloaded and loaded height at the rear.", "Adjust preload until sag is in the range you're aiming for.", "Set rebound, then write the settings down."], ["L-003"])

task("M-001", "Refit the bodywork", "finish", "Low", 2.0, "Hex keys",
     "Refit the panels in reverse order using the labeled fasteners.",
     "Correct fasteners keep panels quiet and mounts intact.", "Every panel fitted; no leftover screws.",
     ["Work through your labeled bags in reverse order.", "Start every screw by hand before tightening.", "Check that no wires or hoses are trapped behind a panel."], ["F-004", "G-003", "H-004", "I-002"])
task("M-002", "Torque-check the critical fasteners", "chassis", "Critical", 1.0, "Torque wrench",
     "Check axles, pinch bolts, caliper bolts, handlebar clamps and the drain bolt against the manual's torque values.",
     "These are the fasteners that keep the wheels and brakes on.", "Each one checked and initialed.",
     ["List the fasteners from the manual's torque table.", "Check each one and mark it with a paint pen.", "Record who checked it."], ["K-003", "J-003", "M-001"])
task("M-003", "Test ride and recheck", "chassis", "Critical", 1.0, "Helmet and gear",
     "Ride carefully, test brakes and ABS at low speed, then recheck for leaks, fluid levels and loose parts.",
     "The first ride is where small mistakes show up.", "Ride notes recorded; nothing leaking or loose.",
     ["Start in a quiet area at low speed.", "Test both brakes and confirm the ABS light is out once moving.", "Afterward, look for leaks and recheck oil, coolant and brake fluid."], ["M-002"])

task("N-001", "Set up the maintenance schedule", "general", "Low", 0.5, "",
     "Open the Maintenance log, check the schedule items against your owner's manual, and set when each was last done.",
     "The log can only tell you what's due once it knows when things were done.", "Every schedule item has a start point.",
     ["Open the Maintenance log.", "Check each interval against your owner's manual and edit it if needed.", "Set when each was last done."], ["M-003"])
task("N-002", "Log the work you just did", "general", "Low", 0.5, "",
     "Log a service record for the work in this project with parts, cost and receipts.",
     "A complete history adds value and makes the next service easy.", "Service logged with parts and receipts.",
     ["Use Log service in the Maintenance log.", "Pick the schedule items it covered so they reset.", "Add parts, costs and receipt links."], ["N-001"])
task("N-003", "Back up the project", "general", "Low", 0.2, "",
     "Download a backup from Settings.", "Your records are worth keeping somewhere safe.", "Backup file saved.",
     ["Open Settings & backups.", "Download a full backup.", "Keep it with the bike's paperwork."], ["N-002"])

MOD_SUB = {"general": "Project", "engine": "Engine", "fuel": "Fuel & air", "electrical": "Electrical", "chassis": "Chassis", "finish": "Bodywork"}
tasks, howto = [], {}
for i, (tid, title, mod, safety, hrs, tools, ins, why, exp, ht, pre) in enumerate(T):
    tasks.append(stamp({"id": tid, "title": title, "instructions": ins, "reason": why, "phase": tid[0], "subsystem": MOD_SUB[mod], "module": mod,
                        "priority": "High" if safety in ("Critical", "High") else "Normal", "safety": safety, "skill": "Intermediate" if hrs >= 1.5 else "Basic",
                        "assignee": "", "estHours": hrs, "estCost": 0, "start": "", "due": "", "status": "Not started", "prereqs": pre, "partIds": [],
                        "tools": tools, "supplies": "", "expected": exp, "inspectionCriteria": exp, "manualRef": VERIFY, "reviewer": "", "approval": "Pending",
                        "completedAt": "", "notes": "", "order": i, "comments": []}))
    howto[tid] = ht

# workshop-area procedure steps: the course steps for each area, in order
steps = []
for mod in ["engine", "fuel", "electrical", "chassis"]:
    for n, t in enumerate([t for t in tasks if t["module"] == mod], 1):
        steps.append(stamp({"id": f"{mod[:3].upper()}-{n:03d}", "module": mod, "seq": n, "workPackage": LESSONS[t["phase"]]["title"], "title": t["title"],
                            "procedure": t["instructions"], "prereqs": ";".join(t["prereqs"]), "tools": t["tools"], "materials": "", "evidence": "Photos and notes",
                            "acceptance": t["expected"], "estHours": t["estHours"], "owner": "", "status": "Not started", "result": "Pending", "reviewer": "",
                            "manualRef": VERIFY, "taskId": t["id"], "notes": ""}))

phases = [stamp({"id": k, "name": L["title"], "order": i, "start": "", "finish": "", "approval": "Not started", "approvedBy": "", "notes": ""}) for i, (k, L) in enumerate(LESSONS.items())]

# ---------------------------------------------------------------- parts
P = [("Engine", "engine", "Engine assembly"), ("Engine", "engine", "Cylinder heads and valve covers"), ("Engine", "engine", "Camshafts and tappets"), ("Engine", "engine", "Clutch and clutch cable"),
     ("Engine", "engine", "Oil filter and drain bolt"), ("Engine", "engine", "Spark plugs (4)"), ("Cooling", "engine", "Radiator and cap"), ("Cooling", "engine", "Radiator hoses and clamps"),
     ("Cooling", "electrical", "Cooling fan"), ("Fuel", "fuel", "Fuel tank and fuel pump"), ("Fuel", "fuel", "Fuel lines and clamps"), ("Fuel", "fuel", "Throttle bodies and injectors"),
     ("Fuel", "fuel", "Air filter and airbox"), ("Fuel", "fuel", "Throttle cables"), ("Exhaust", "engine", "Exhaust headers and muffler"),
     ("Electrical", "electrical", "Battery"), ("Electrical", "electrical", "Stator"), ("Electrical", "electrical", "Regulator/rectifier"), ("Electrical", "electrical", "Main wiring harness and grounds"),
     ("Electrical", "electrical", "Headlights and turn signals"), ("Electrical", "electrical", "Tail and brake light"), ("Electrical", "electrical", "Brake light switches"), ("Electrical", "electrical", "Instrument cluster"),
     ("Electrical", "electrical", "Handlebar switches"), ("Electrical", "electrical", "ABS unit and wheel sensors"), ("Chassis", "chassis", "Frame"), ("Chassis", "chassis", "Subframe and luggage rack"),
     ("Chassis", "chassis", "Swingarm and linkage"), ("Chassis", "chassis", "Front forks"), ("Chassis", "chassis", "Rear shock"), ("Chassis", "chassis", "Steering head bearings"),
     ("Wheels", "chassis", "Front wheel and bearings"), ("Wheels", "chassis", "Rear wheel, bearings and cush drive"), ("Wheels", "chassis", "Front tire (110/80R19)"), ("Wheels", "chassis", "Rear tire (150/70R17)"),
     ("Brakes", "chassis", "Front calipers and pads"), ("Brakes", "chassis", "Rear caliper and pads"), ("Brakes", "chassis", "Front brake discs"), ("Brakes", "chassis", "Rear brake disc"),
     ("Brakes", "chassis", "Brake master cylinders and hoses"), ("Final drive", "chassis", "Drive chain"), ("Final drive", "chassis", "Front and rear sprockets"),
     ("Controls", "chassis", "Handlebars, levers and mirrors"), ("Controls", "chassis", "Footpegs and shift/brake pedals"), ("Cosmetics", "finish", "Fairing and windscreen"),
     ("Cosmetics", "finish", "Tank covers and side panels"), ("Cosmetics", "finish", "Seat"), ("Cosmetics", "finish", "Side stand and center stand")]
parts = []
for i, (cat, mod, name) in enumerate(P, 1):
    parts.append(stamp({"id": f"INV-{i:04d}", "name": name, "oemPn": "", "pnVerified": False, "category": cat, "subsystem": cat, "module": mod, "parent": "",
                        "qtyExpected": 1, "qtyFound": 1, "qtyServiceable": 0, "qtyDamaged": 0, "qtyMissing": 0, "condition": "Uninspected", "status": "Not started",
                        "workRequired": "", "cleaning": "Not required", "replacement": "Unknown", "classification": "Unknown", "location": "On the bike", "bin": "",
                        "assignee": "", "priority": "Normal", "estCost": 0, "disposition": "Undecided", "notes": ""}))
pid = {p["name"]: p["id"] for p in parts}

# ---------------------------------------------------------------- inspections and measurements
I = [("Battery", "Battery voltage after full charge", "V", "Multimeter", True), ("Regulator/rectifier", "Charging voltage at the battery, engine running", "V", "Multimeter", True),
     ("Stator", "Stator output and resistance test", "V / ohms", "Multimeter", False), ("Cylinder heads and valve covers", "Valve clearances, every valve, engine cold", "mm", "Feeler gauges", False),
     ("Throttle bodies and injectors", "Throttle-body balance", "vacuum", "Vacuum gauges", False), ("Throttle cables", "Throttle cable free play", "mm", "Ruler", True),
     ("Clutch and clutch cable", "Clutch cable free play", "mm", "Ruler", False), ("Spark plugs (4)", "Spark plug type and gap", "mm", "Gap gauge", False),
     ("Front tire (110/80R19)", "Front tire tread depth and date code", "mm", "Tread gauge", True), ("Rear tire (150/70R17)", "Rear tire tread depth and date code", "mm", "Tread gauge", True),
     ("Front brake discs", "Front disc thickness, both discs", "mm", "Micrometer", True), ("Rear brake disc", "Rear disc thickness", "mm", "Micrometer", True),
     ("Front calipers and pads", "Front pad thickness", "mm", "Ruler", True), ("Rear caliper and pads", "Rear pad thickness", "mm", "Ruler", True),
     ("Drive chain", "Chain wear over the measured length", "mm", "Ruler or chain gauge", True), ("Drive chain", "Chain slack", "mm", "Ruler", True),
     ("Steering head bearings", "Steering play and notchiness", "", "By hand", True), ("Front forks", "Fork seals dry, damping smooth", "", "Visual", True),
     ("Rear shock", "Rear sag with rider", "mm", "Tape measure", False), ("Radiator and cap", "Coolant level and condition", "", "Visual", False)]
inspections = [stamp({"id": f"INS-{i:04d}", "partId": pid[p], "component": p, "point": pt, "procedure": "Follow the factory service manual procedure for this check.", "spec": VERIFY,
                      "min": "", "max": "", "actual": "", "units": u, "tool": tool, "technician": "", "date": "", "result": "Pending", "corrective": "", "reinspection": "",
                      "reviewer": "", "manualRef": VERIFY, "evidence": "", "safetyCritical": sc, "notes": ""}) for i, (p, pt, u, tool, sc) in enumerate(I, 1)]

# ---------------------------------------------------------------- safety checks and gates
C = [("Recalls", "Every recall done or booked", "Critical", "A-002", "NHTSA lookup shows no open recalls, or dealer work booked in writing."),
     ("Fasteners", "Critical fasteners torque-checked", "Critical", "M-002", "Axles, pinch bolts, caliper bolts and bar clamps checked to the manual's values and marked."),
     ("Brakes", "Front brake firm and strong", "Critical", "K-003", "Firm lever, no leaks, pads and discs in limits."),
     ("Brakes", "Rear brake firm and strong", "Critical", "K-003", "Firm pedal, no leaks, pad and disc in limits."),
     ("Brakes", "ABS warning light behaves normally", "Critical", "F-004", "Light on with the key, off once moving."),
     ("Tires", "Tires in date, tread and pressure", "Critical", "J-001", "Date codes recorded, tread above the legal minimum, pressures set."),
     ("Wheels", "Wheel bearings and axles", "Critical", "J-002", "No play; axles torqued."),
     ("Steering", "Steering free with no play", "Critical", "L-002", "Turns lock to lock smoothly, no play, no cable pull."),
     ("Suspension", "Forks and shock not leaking", "High", "L-001", "Tubes and shock dry after compressions."),
     ("Chain", "Chain and sprockets in limits, slack set", "Critical", "J-003", "Wear and slack within the manual's figures."),
     ("Lights", "Headlight, signals, tail and brake light", "Critical", "F-004", "Brake light works from lever and pedal."),
     ("Controls", "Throttle snaps shut, clutch frees", "Critical", "H-003", "Throttle returns with bars at both locks; clutch fully disengages."),
     ("Cooling", "Coolant full and fan working", "High", "G-003", "Level correct cold; fan cycles at temperature."),
     ("Fluids", "Oil level correct, no leaks", "High", "I-001", "Level in the window; drain bolt and filter dry."),
     ("Fuel", "No fuel leaks", "Critical", "H-002", "Lines and clamps dry with the engine running."),
     ("Stand", "Side-stand switch cuts the engine", "High", "F-004", "Engine stops when in gear with the stand down.")]
checks = [stamp({"id": f"SAFE-{i:03d}", "system": s, "check": c, "criteria": cr, "criticality": crit, "links": link, "result": "Pending", "evidence": "", "inspector": "",
                 "reviewer": "", "date": "", "corrective": "", "reinspection": "", "notes": ""}) for i, (s, c, crit, link, cr) in enumerate(C, 1)]
G = [("Bike identified and recalls checked", "A-001;A-002;A-003", "Model, VIN and recall status recorded."),
     ("Condition recorded and job list agreed", "B-001;B-002;B-003;B-004;B-005", "Before photos, fluid checks and the job list are in the app."),
     ("Electrical and charging pass", "F-001;F-002;F-003;F-004", "Battery, charging readings and lights all pass."),
     ("Cooling, fuel and air done", "G-001;G-002;G-003;H-001;H-002;H-003;H-004", "Coolant, hoses, filter, lines and sync done or recorded as not needed."),
     ("Engine service done", "I-001;I-002;I-003", "Oil, filter, plugs and clutch play done."),
     ("Wheels, tires, chain and brakes pass", "J-001;J-002;J-003;K-001;K-002;K-003;K-004", "All in limits with fresh brake fluid."),
     ("Suspension and steering pass", "L-001;L-002;L-003", "No leaks, no steering play, linkage greased."),
     ("Road test passed", "M-001;M-002;M-003", "Fasteners checked, ride done, recheck clean.")]
gates = [stamp({"id": f"GATE-{i:02d}", "name": n, "criteria": cr, "prereqs": pre, "status": "Not started", "result": "", "reviewer": "", "date": "", "corrective": "",
                "evidence": "", "blocks": True, "required": True, "notes": ""}) for i, (n, pre, cr) in enumerate(G, 1)]

# ---------------------------------------------------------------- known issues for this model, with sources
issues = [
    stamp({"id": "ISS-0001", "date": "", "ref": "A-002", "partId": pid["Stator"], "type": "Safety concern", "description": "Stator recall (NHTSA 16V878000): 2012-2016 DL650 stators could overheat and short, which can stall the engine.",
           "severity": "Critical", "safety": "Yes", "rootCause": "", "proposed": "Check the VIN on nhtsa.gov/recalls. If open, a Suzuki dealer replaces the stator for free.", "costImpact": 0, "timeImpact": 0,
           "owner": "", "ownerRole": "", "decisionFrom": "Project owner", "target": "", "status": "Open", "decision": "", "corrective": "", "verification": "", "signoff": "",
           "notes": "Source: Motorcyclist, https://motorcyclistonline.com/suzuki-recalls-2012-2016-dl650-v-strom-adv-motorcycles"}),
    stamp({"id": "ISS-0002", "date": "", "ref": "A-002", "partId": pid["Camshafts and tappets"], "type": "Engine wear", "description": "Camshaft and tappet recall (NHTSA 15V852000) for 2012-2014 DL650A.",
           "severity": "High", "safety": "Potential", "rootCause": "", "proposed": "Ask a Suzuki dealer whether it's been done for this VIN. Check valve clearances if unsure.", "costImpact": 0, "timeImpact": 0,
           "owner": "", "ownerRole": "", "decisionFrom": "Project owner", "target": "", "status": "Open", "decision": "", "corrective": "", "verification": "", "signoff": "",
           "notes": "Source: NHTSA bulletin, https://static.nhtsa.gov/odi/rcl/2015/RCMN-15V852-5339.pdf"}),
    stamp({"id": "ISS-0003", "date": "", "ref": "F-004", "partId": pid["Brake light switches"], "type": "Safety concern", "description": "Front brake light switch recall (12V038000) listed for the 2012 DL650A.",
           "severity": "High", "safety": "Yes", "rootCause": "", "proposed": "Confirm by VIN at nhtsa.gov/recalls and with a dealer. Test the brake light from the front lever.", "costImpact": 0, "timeImpact": 0,
           "owner": "", "ownerRole": "", "decisionFrom": "Project owner", "target": "", "status": "Open", "decision": "", "corrective": "", "verification": "", "signoff": "",
           "notes": "Found on an aggregator only (au7o.io). Confirm with NHTSA by VIN."}),
]

# ---------------------------------------------------------------- maintenance schedule (sourced, flagged third-party)
S = [("Engine oil", "Engine", 4000, 12, "6,000 km. The table shows replace at every service."),
     ("Oil filter", "Engine", 11000, 36, "18,000 km per the table. Many owners change it with every oil change."),
     ("Air filter replace", "Fuel & air", 11000, 36, "18,000 km. Inspect it at every oil change."),
     ("Spark plugs replace (4)", "Engine", 7500, 24, "12,000 km. Inspect at 4,000 mi."),
     ("Valve clearance check", "Engine", 14500, 48, "24,000 km. Rider magazine's road test also gives 14,500 miles."),
     ("Throttle-body sync", "Fuel & air", 7500, 24, "12,000 km."),
     ("Fuel lines replace", "Fuel & air", 0, 48, "Inspect at every service."),
     ("Engine coolant replace", "Cooling", 0, 48, ""),
     ("Radiator hoses replace", "Cooling", 0, 48, "Inspect at every service."),
     ("Brake fluid replace", "Brakes", 0, 24, "Inspect the level at every service."),
     ("Brake hoses replace", "Brakes", 0, 48, "Inspect at every service."),
     ("Brakes inspect", "Brakes", 4000, 12, ""),
     ("Tires inspect", "Tires & wheels", 4000, 12, "Check pressures far more often than this."),
     ("Steering, forks and rear suspension inspect", "Suspension & steering", 7500, 24, ""),
     ("Clutch and throttle cable play", "Controls & cables", 4000, 12, ""),
     ("Chassis and exhaust bolts tighten", "General", 4000, 12, "")]
schedule = [stamp({"id": f"SVC-{i:03d}", "name": n, "category": c, "everyMiles": mi, "everyMonths": mo, "lastDate": "", "lastMiles": 0, "source": SCHED_SRC, "notes": note, "order": i})
            for i, (n, c, mi, mo, note) in enumerate(S, 1)]
schedule.append(stamp({"id": "SVC-017", "name": "Chain clean and lube", "category": "Drivetrain", "everyMiles": 500, "everyMonths": 0, "lastDate": "", "lastMiles": 0,
                       "source": "Typical interval, not yet checked against the service manual", "notes": "Not in the published table. Also after riding in rain.", "order": 17}))

# ---------------------------------------------------------------- tools, purchases, sources, docs, meta
tools = [stamp({"id": f"TOOL-{i:03d}", "name": n, "category": c, "qty": "1", "available": "Unknown", "cost": 0, "location": "", "assignee": "", "usage": u, "safety": "",
                "calibration": "", "status": "Planning", "notes": ""}) for i, (n, c, u) in enumerate([
    ("Torque wrench", "Measuring tool", "Every fastener with a torque value in the manual."), ("Multimeter", "Measuring tool", "Battery, charging and circuit tests."),
    ("Smart battery charger", "Electrical", "Charging and maintaining the battery."), ("Rear stand", "Workshop", "Holding the bike upright with the rear wheel off the ground."),
    ("Two-gauge vacuum sync tool", "Measuring tool", "Throttle-body synchronization."), ("Feeler gauges", "Measuring tool", "Valve clearance check."),
    ("Brake bleed kit", "Brakes", "Brake fluid replacement."), ("Hex and Torx sets", "Hand tool", "Bodywork and most fasteners."),
    ("Plastic trim tools", "Hand tool", "Releasing panel clips without damage."), ("Tire pressure gauge and tread gauge", "Measuring tool", "Tire checks."),
    ("Drain pan and funnels", "Workshop", "Oil and coolant changes."), ("Spark plug socket with extension", "Hand tool", "Reaching the plugs, especially the rear cylinder.")], 1)]
purchases = [stamp({"id": f"PUR-{i:04d}", "partId": pid.get(p, ""), "taskId": tk, "description": d, "oemPn": "", "sourceType": st, "qty": q, "supplier": "", "url": "", "unitPrice": 0,
                    "shipping": 0, "tax": 0, "fees": 0, "quoteDate": "", "orderDate": "", "expected": "", "delivered": "", "status": "Research", "tracking": "", "returnBy": "",
                    "warranty": "", "fitment": "Pending", "fitmentSource": "", "qc": "Pending", "receipt": "", "buyer": "", "notes": ""}) for i, (d, p, tk, st, q) in enumerate([
    ("Factory service manual, 2012 DL650A", "", "A-003", "Reference / Tool", 1), ("Oil filter and drain bolt washer", "Oil filter and drain bolt", "I-001", "OEM / Aftermarket", 1),
    ("Engine oil (type and amount from the manual)", "Engine assembly", "I-001", "OEM / Aftermarket", 1), ("Air filter", "Air filter and airbox", "H-001", "OEM / Aftermarket", 1),
    ("Spark plugs, set of 4", "Spark plugs (4)", "I-002", "OEM / Aftermarket", 4), ("Coolant (type from the manual)", "Radiator and cap", "G-001", "OEM / Aftermarket", 1),
    ("Brake fluid (type on the reservoir cap)", "Brake master cylinders and hoses", "K-003", "OEM / Aftermarket", 1)], 1)]
sources = [stamp({"id": f"SRC-{i:03d}", "title": t, "publisher": pub, "url": u, "applies": a, "subject": sub, "verification": v, "notes": ""}) for i, (t, pub, u, a, sub, v) in enumerate([
    ("Suzuki DL650 V-Strom (2012-13) specifications", "MotorcycleSpecs", "https://www.motorcyclespecs.co.za/model/suzu/suzuki_dl650_v%2012.htm", "2012-2013 DL650 ABS", "Specs", "Third-party spec sheet"),
    ("2012 Suzuki V-Strom 650 ABS road test", "Rider", "https://ridermagazine.com/2012/01/13/2012-suzuki-v-strom-650-abs-road-test/", "2012 V-Strom 650 ABS", "Specs, changes, test notes", "Magazine test"),
    ("2012 Suzuki V-Strom 650 ABS", "Cycle World", "https://issues.cycleworld.com/article/2011/9/1/2012-suzuki-v-strom-650-abs", "2012 V-Strom 650 ABS", "What changed for 2012", "Magazine"),
    ("V-Strom 650 2nd gen (2012-2016) maintenance schedule", "maintenanceschedule.com", "https://maintenanceschedule.com/suzuki-v-strom-650-2nd-gen-2012-2016/", "2012-2016 DL650", "Service intervals", "Third-party copy of the owner's manual table. Check your manual."),
    ("Stator recall 2012-2016 DL650", "Motorcyclist", "https://motorcyclistonline.com/suzuki-recalls-2012-2016-dl650-v-strom-adv-motorcycles", "2012-2016 DL650", "Recall 16V878000", "News report of NHTSA recall"),
    ("Camshaft/tappet recall bulletin", "NHTSA", "https://static.nhtsa.gov/odi/rcl/2015/RCMN-15V852-5339.pdf", "2012-2014 DL650A", "Recall 15V852000", "Manufacturer bulletin"),
    ("2012 Suzuki V-Strom 650 OEM parts diagrams", "RevZilla", "https://www.revzilla.com/oem/suzuki/2012-suzuki-v-strom-650", "2012 V-Strom 650", "Parts diagrams and numbers", "Parts fiche, not a service manual")], 1)]
docs = [stamp({"id": f"DOC-{i:04d}", "title": t, "kind": k, "taskId": tk, "partId": "", "inspectionId": "", "purchaseId": "", "folder": "", "caption": "", "tags": "", "date": "",
               "link": "", "file": "", "fileName": "", "planned": True, "notes": ""}) for i, (t, k, tk) in enumerate([
    ("Before photos, all sides", "Before photo", "B-001"), ("VIN and frame label (keep private)", "Before photo", "A-001"), ("Stator connector close-up", "During photo", "F-002"),
    ("Receipts", "Receipt", "N-002")], 1)]
meta = stamp({"id": "project", "projectName": "V-Strom 650 project", "bike": "2012 Suzuki V-Strom 650", "variant": "V-Strom 650 ABS or ABS Adventure (DL650A): confirm from the VIN",
              "frameNo": "", "engineNo": "", "color": "", "units": "in", "currency": "USD", "baseBudget": 2000, "contingencyPct": 15, "budgetChanges": [], "laborRate": 0,
              "showLaborValue": False, "roadReady": False, "roadReadyBy": "", "roadReadyDate": "", "meshMap": {},
              "expenseCategories": ["Service parts", "Fluids", "Tires", "Chain and sprockets", "Brake parts", "Electrical parts", "Suspension", "Bodywork", "Tools", "Dealer or shop labor", "Other"]})

baseline = {"phases": phases, "parts": parts, "tasks": tasks, "steps": steps, "finishes": [], "inspections": inspections, "purchases": purchases, "expenses": [],
            "gates": gates, "checks": checks, "issues": issues, "decisions": [], "maintenance": [], "schedule": schedule, "tools": tools, "docs": docs,
            "sources": sources, "team": [], "worklogs": [], "meta": [meta]}

# ---------------------------------------------------------------- content.json: the bike's own text
content = {
    "lessons": LESSONS,
    "howto": howto,
    "sections": {"fuel": {"t": "Fuel & air", "d": "Injection, air filter, sync"}, "finish": {"t": "Cleaning & bodywork", "d": "Washing, panels, fasteners"},
                 "chassis": {"t": "Wheels, brakes & suspension", "d": "Tires, chain, ABS brakes, forks, shock"}},
    "moduleIntro": {
        "engine": "Oil and filter, spark plugs, cooling system, clutch and valve clearances. Every number comes from the factory service manual.",
        "fuel": "Air filter, fuel lines, throttle bodies, throttle cable and a two-cylinder sync. The fuel injection itself rarely needs touching.",
        "electrical": "Battery, charging system (stator and regulator), grounds, lights, switches and the ABS warning light.",
        "chassis": "Tires, wheel bearings, chain and sprockets, ABS brakes, forks, steering bearings and the rear shock. Most items here are safety-critical.",
        "finish": "Cleaning, bodywork removal and refitting. Label every fastener."},
    "guide": {
        "fuel": {"title": "Fuel & air", "sub": "Air filter, fuel lines, throttle bodies, cable play and sync.", "how": ["Plug intake openings whenever the airbox is off.", "Sync the throttle bodies with a vacuum gauge set.", "Replace fuel lines on the four-year schedule."]},
        "engine": {"title": "Engine & cooling", "sub": "Oil, plugs, coolant, clutch and valve clearances.", "how": ["Work the procedure top to bottom and tick each step as you go.", "Measurements and torque values come from the factory manual.", "Check the cam recall with a dealer before the valve check."]},
        "chassis": {"title": "Wheels, brakes & suspension", "sub": "Tires, chain, ABS brakes, forks, steering and shock.", "how": ["Most items here are safety-critical and need a second person to check.", "Check tire date codes, not just tread.", "Bleed the ABS brakes exactly as the manual describes."]},
        "finish": {"title": "Cleaning & bodywork", "sub": "Washing, removing and refitting panels.", "how": ["Bag and label every fastener with where it came from.", "Release clips with plastic tools.", "Keep water out of connectors and the intake."]},
        "diagrams": {"title": "Parts diagrams", "sub": "Factory parts diagrams for the 2012 V-Strom 650."},
        "shops": {"sub": "Places to find parts, diagrams and help for a 2012 V-Strom 650. Prices change, so the app never guesses them.", "how": ["Start with the factory parts diagrams to get the right part number.", "Compare prices across shops, including shipping.", "Every part's detail panel also has its own links."]},
        "course": {"title": "The course", "sub": "Fourteen parts that take a used 2012 V-Strom 650 to fully sorted, in the order the work usually happens."},
        "home": {"how": ["Follow the course from Part 1 to Part 14. You can skip parts that don't apply to your bike.", "Tick steps off as you finish them. Progress updates everywhere.", "Set up the Maintenance log at the end so you always know what's due."]},
    },
    "shops": {
        "fiche": {"name": "Factory parts diagrams", "url": "https://www.revzilla.com/oem/suzuki/2012-suzuki-v-strom-650", "short": "2012 V-Strom 650 diagrams", "what": "Exploded diagrams and part numbers for the 2012 V-Strom 650, by area of the bike.", "tags": ["Original parts", "Diagrams"]},
        "nhtsa": {"name": "NHTSA recall lookup", "url": "https://www.nhtsa.gov/recalls", "short": "Check recalls by VIN", "what": "Enter the VIN to see open safety recalls. Recall repairs are free at a Suzuki dealer.", "tags": ["Recalls", "Free"]},
        "stromtrooper": {"name": "StromTrooper", "url": "https://stromtrooper.com", "short": "V-Strom owners' forum", "what": "A big V-Strom owners' community with how-tos and troubleshooting threads for the DL650.", "tags": ["Help", "Forum"]},
        "manuals": {"name": "Service manuals", "url": "https://haynes.com", "short": "Repair manuals", "what": "Repair manuals that cover the V-Strom 650. The factory service manual is still the one to get for exact specs.", "tags": ["Manuals"]},
        "sudco": None, "z1": None, "gsr": None, "caswell": None, "por15": None, "cmsnl": None, "partzilla": None,
    },
    "catShops": {"Engine": ["fiche", "revzilla"], "Cooling": ["fiche", "revzilla"], "Fuel": ["fiche", "revzilla"], "Exhaust": ["fiche"], "Electrical": ["ricks", "fiche"],
                 "Chassis": ["allballs", "fiche"], "Wheels": ["allballs", "revzilla", "denniskirk"], "Brakes": ["fiche", "revzilla", "denniskirk"],
                 "Final drive": ["revzilla", "denniskirk"], "Controls": ["fiche", "revzilla"], "Cosmetics": ["fiche", "ebay"], "_default": ["fiche", "revzilla"]},
    "guides": {
        "paint": None, "carbs": None,
        "efi": {"title": "Fuel injection basics", "img": None, "cover": "fuel", "icon": "fuel", "sum": "How the V-Strom's injection works and what you actually service.", "body": [
            ["What it does", "The ECU reads sensors (throttle position, air, temperature) and opens an injector for each cylinder for just the right time. There's nothing to jet or adjust like on a carb."],
            ["What you service", "The air filter, the fuel lines and clamps, the throttle cable play and the balance between the two throttle bodies. The injectors themselves rarely need attention."],
            ["Throttle-body sync", "Each cylinder has its own throttle body. Over time they drift apart and the bike gets lumpy at low speed. A two-gauge vacuum tool and the manual's procedure bring them back in balance."],
            ["Warning signs", "A flashing FI light, hard starting or surging. Read the fault code the way the manual shows before replacing anything."]]},
        "charging": {"title": "Charging system checks", "img": None, "cover": "electrical", "icon": "bolt", "sum": "Battery, stator and regulator: how to tell which one is failing.", "body": [
            ["How it works", "The stator makes AC power as the engine turns. The regulator/rectifier turns it into DC and holds the voltage steady for the battery and lights."],
            ["Start with the battery", "Charge it fully and test it. A tired battery makes everything else look broken."],
            ["Then the connector", "Look at the plug between the stator and the regulator. Brown, melted or loose pins mean heat, and heat means trouble. The 2012-2016 stators were also recalled."],
            ["Then measure", "Use the manual's charging test: voltage at the battery at set engine speeds, then stator output and resistance. Compare every reading with the manual."]]},
        "electrical": {"img": None, "icon": "bolt", "cover": "electrical"}, "brakes": {"img": None, "icon": "shield", "cover": "brakes", "sum": "Disc brakes with ABS, what wears out, and how to change the fluid."},
        "wheels": {"title": "Wheels & tires", "img": None, "cover": "wheels", "icon": "wheel", "sum": "Reading a tire's age, wheel bearings and the rear cush drive.", "body": [
            ["Tire age", "Every tire has a four-digit date code on the sidewall: the week, then the year. Old rubber gets hard and slippery even with tread left."],
            ["Sizes", "The 2012 V-Strom 650 uses a 110/80R19 front and a 150/70R17 rear."],
            ["Bearings", "With the wheel off the ground, rock it at the top and bottom and spin it. Any play or grinding means new bearings."],
            ["Cush drive", "Rubber blocks in the rear hub soak up driveline shock. With the wheel out, check them for cracks and play."]]},
        "cleaning": {"img": None, "icon": "spray", "sum": "Washing a modern bike without soaking the electrics.", "body": [
            ["Protect first", "Cover the air intake, the exhaust outlets and any open connectors before you wash."],
            ["Gentle cleaners", "Use a degreaser that's safe on paint, plastic and aluminum. Avoid strong acids and wheel cleaners on bare metal."],
            ["Go easy with pressure", "Keep a pressure washer away from bearings, seals, the instrument cluster and connectors."],
            ["Dry it", "Blow or wipe it dry, then run the engine briefly to drive off moisture."]]},
        "organizing": {"img": None, "icon": "box", "title": "Labeling fasteners and panels", "sum": "Keep screws and panels in order so the bodywork goes back on easily.", "body": [
            ["Bag by panel", "Each panel's screws go in their own bag, labeled with the panel name."],
            ["Photograph first", "Take a photo of each panel before removing it, showing where every screw goes."],
            ["Store panels safely", "Lay panels on a towel, painted side up, away from where you're working."]]},
    },
    "suggestions": [
        ["Check recalls first", "Recall repairs are free at a dealer. Run the VIN through NHTSA before buying parts for the same job."],
        ["Get the factory service manual", "Torque values, clearances and procedures come from the manual for the 2012 DL650A."],
        ["Order service parts together", "Oil filter, air filter, four spark plugs, coolant and brake fluid in one order."],
        ["Replace aged rubber", "Fuel lines, radiator hoses and brake hoses are on four-year replace schedules even if they look fine."],
        ["Compare the delivered price", "Add shipping and tax before deciding which shop is cheapest."],
        ["Ask the owners' forum", "V-Strom owners have solved most problems before."]],
}

(HERE / "baseline.json").write_text(json.dumps(baseline, indent=1, ensure_ascii=False))
(HERE / "content.json").write_text(json.dumps(content, indent=1, ensure_ascii=False))
print(len(tasks), "steps,", len(parts), "parts,", len(inspections), "checks,", len(schedule), "schedule items")
