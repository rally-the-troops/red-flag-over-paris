"use strict"

const data = require("./data")

const RED_CUBE_POOL = [0, 1, 2]
const RED_CRISIS_TRACK = [3, 4, 5, 6]
const RED_BONUS_CUBES = [7, 8, 9]
const BLUE_CUBE_POOL = 10
const BLUE_CRISIS_TRACK = [11, 12, 13, 14]
const BLUE_BONUS_CUBES = [15, 16, 17]
const PRUSSIAN_COLLABORATION = [18, 19, 20]
const S_ROYALISTS = 21
const S_NATIONAL_ASSEMBLY = 22
const S_REPUBLICANS = 23
const S_CATHOLIC_CHURCH = 24
const S_PRESS = 25
const S_SOCIAL_MOVEMENTS = 26
const S_MONT_VALERIEN = 27
const S_BUTTE_MONTMARTRE = 28
const S_FORT_D_ISSY = 29
const S_BUTTE_AUX_CAILLES = 30
const S_PERE_LACHAISE = 31
const S_CHATEAU_DE_VINCENNES = 32
const S_PRUSSIAN_OCCUPIED_TERRITORY = 33
const S_VERSAILLES_HQ = 34

const crisis_zones = [
	{
		id: RED_CRISIS_TRACK[0],
		name: "Starting",
		player: "Commune",
		size: 3,
		is_breachable: false
	},
	{
		id: RED_CRISIS_TRACK[1],
		name: "Escalation",
		player: "Commune",
		size: 2,
		is_breachable: true,
		bonus_area: RED_BONUS_CUBES[0]
	},
	{
		id: RED_CRISIS_TRACK[2],
		name: "Tension",
		player: "Commune",
		size: 2,
		is_breachable: true,
		bonus_area: RED_BONUS_CUBES[1]
	},
	{
		id: RED_CRISIS_TRACK[3],
		name: "Final Crisis",
		player: "Commune",
		size: 2,
		is_breachable: true,
		bonus_area: RED_BONUS_CUBES[2]
	},
	{
		id: BLUE_CRISIS_TRACK[0],
		name: "Starting",
		player: "Versailles",
		size: 1,
		is_breachable: false
	},
	{
		id: BLUE_CRISIS_TRACK[1],
		name: "Escalation",
		player: "Versailles",
		size: 2,
		is_breachable: true,
		bonus_area: BLUE_BONUS_CUBES[0]
	},
	{
		id: BLUE_CRISIS_TRACK[2],
		name: "Tension",
		player: "Versailles",
		size: 1,
		is_breachable: true,
		bonus_area: BLUE_BONUS_CUBES[1]
	},
	{
		id: BLUE_CRISIS_TRACK[3],
		name: "Final Crisis",
		player: "Versailles",
		size: 2,
		is_breachable: true,
		bonus_area: BLUE_BONUS_CUBES[2]
	}
];
const spaces = [
	{
		id: S_ROYALISTS,
		name: "Royalists",
		type: "Political",
		dimension: "Institutional",
		is_pivotal_space: false,
		is_eligible_for_pieces: true,
		adjacent_to: [S_CATHOLIC_CHURCH, S_PRESS],
		presence: ["Versailles"],
		permanent_presence: "Versailles",
		controlled_by: "Versailles"
	},
	{
		id: S_NATIONAL_ASSEMBLY,
		name: "National Assembly",
		type: "Political",
		dimension: "Institutional",
		is_pivotal_space: true,
		is_eligible_for_pieces: true,
		adjacent_to: [S_ROYALISTS, S_REPUBLICANS],
		presence: [],
		controlled_by: "None"
	},
	{
		id: S_REPUBLICANS,
		name: "Republicans",
		type: "Political",
		dimension: "Institutional",
		is_pivotal_space: false,
		is_eligible_for_pieces: true,
		adjacent_to: [S_PRESS, S_SOCIAL_MOVEMENTS],
		presence: [],
		controlled_by: "None"
	},
	{
		id: S_CATHOLIC_CHURCH,
		name: "Catholic Church",
		type: "Political",
		dimension: "Public Opinion",
		is_pivotal_space: false,
		is_eligible_for_pieces: true,
		adjacent_to: [S_ROYALISTS, S_PRESS],
		presence: [],
		controlled_by: "None"
	},
	{
		id: S_PRESS,
		name: "Press",
		type: "Political",
		dimension: "Public Opinion",
		is_pivotal_space: true,
		is_eligible_for_pieces: true,
		adjacent_to: [S_ROYALISTS, S_REPUBLICANS, S_CATHOLIC_CHURCH, S_SOCIAL_MOVEMENTS],
		presence: ["Versailles", "Commune"],
		controlled_by: "None"
	},
	{
		id: S_SOCIAL_MOVEMENTS,
		name: "Social Movements",
		type: "Political",
		dimension: "Public Opinion",
		is_pivotal_space: false,
		is_eligible_for_pieces: true,
		adjacent_to: [S_REPUBLICANS, S_PRESS],
		presence: ["Commune"],
		permanent_presence: "Commune",
		controlled_by: "Commune"
	},
	{
		id: S_MONT_VALERIEN,
		name: "Mont Valérien",
		type: "Military",
		dimension: "Forts",
		is_pivotal_space: true,
		is_eligible_for_pieces: true,
		adjacent_to: [S_BUTTE_MONTMARTRE, S_VERSAILLES_HQ],
		presence: [],
		controlled_by: "None"
	},
	{
		id: S_BUTTE_MONTMARTRE,
		name: "Butte Montmartre",
		type: "Military",
		dimension: "Paris",
		is_pivotal_space: true,
		is_eligible_for_pieces: true,
		adjacent_to: [S_MONT_VALERIEN, S_BUTTE_AUX_CAILLES, S_PERE_LACHAISE],
		presence: [],
		controlled_by: "None"
	},
	{
		id: S_FORT_D_ISSY,
		name: "Fort D'Issy",
		type: "Military",
		dimension: "Forts",
		is_pivotal_space: false,
		is_eligible_for_pieces: true,
		adjacent_to: [S_VERSAILLES_HQ, S_BUTTE_AUX_CAILLES, S_CHATEAU_DE_VINCENNES],
		presence: [],
		controlled_by: "None"
	},
	{
		id: S_BUTTE_AUX_CAILLES,
		name: "Butte-Aux-Cailles",
		type: "Military",
		dimension: "Paris",
		is_pivotal_space: false,
		is_eligible_for_pieces: true,
		adjacent_to: [S_FORT_D_ISSY, S_BUTTE_MONTMARTRE, S_PERE_LACHAISE],
		presence: [],
		controlled_by: "None"
	},
	{
		id: S_PERE_LACHAISE,
		name: "Père Lachaise",
		type: "Military",
		dimension: "Paris",
		is_pivotal_space: false,
		is_eligible_for_pieces: true,
		adjacent_to: [S_BUTTE_MONTMARTRE, S_BUTTE_AUX_CAILLES, S_CHATEAU_DE_VINCENNES, S_PRUSSIAN_OCCUPIED_TERRITORY],
		presence: ["Commune"],
		permanent_presence: "Commune",
		controlled_by: "Commune"
	},
	{
		id: S_CHATEAU_DE_VINCENNES,
		name: "Château de Vincennes",
		type: "Military",
		dimension: "Forts",
		is_pivotal_space: false,
		is_eligible_for_pieces: true,
		adjacent_to: [S_FORT_D_ISSY, S_PERE_LACHAISE, S_PRUSSIAN_OCCUPIED_TERRITORY],
		presence: [],
		controlled_by: "None"
	},
	{
		id: S_PRUSSIAN_OCCUPIED_TERRITORY,
		name: "Prussian Occupied Territory",
		type: "Standalone",
		dimension: "Standalone",
		is_pivotal_space: false,
		is_eligible_for_pieces: false,
		adjacent_to: [S_PERE_LACHAISE, S_CHATEAU_DE_VINCENNES],
		controlled_by: "None"
	},
	{
		id: S_VERSAILLES_HQ,
		name: "Versailles HQ",
		type: "Standalone",
		dimension: "Standalone",
		is_pivotal_space: false,
		is_eligible_for_pieces: false,
		adjacent_to: [S_MONT_VALERIEN, S_FORT_D_ISSY],
		controlled_by: "Versailles"
	}
];
let game, view;
let states = {}

exports.scenarios = ["Standard"]
exports.roles = ["Commune", "Versailles"]

exports.action = function (state, current, action, arg) {
	game = state
	if (action in states[game.state]) {
		states[game.state][action](arg, current)
	} else {
		if (action === "undo" && game.undo && game.undo.length > 0)
			pop_undo()
		else
			throw new Error("Invalid action: " + action)
	}
	return game
}

exports.resign = function (state, current) {
	game = state
	if (game.state !== "game_over") {
		log_br()
		log(`${current} resigned.`)
		game.state = "game_over"
		game.active_player = null
		game.state = "game_over"
		game.result = (current === "Commune" ? "Versailles" : "Commune")
		game.victory = current + " resigned."
	}
	return game
}

exports.is_checkpoint = function (a, b) {
	return a.round !== b.round
}

exports.view = function(state, current) {
	game = state;
	view = {
		log: game.log,
		prompt: null,
		actions: null,
		round: game.round,
		initiative: game.initiative,
		political_vp: game.political_vp,
		military_vp: game.military_vp,
		red_hand: game.red_hand.length,
		blue_hand: game.blue_hand.length,
		red_momentum: game.red_momentum,
		blue_momentum: game.blue_momentum,
		spaces: game.spaces,
		discs: game.discs,
		cubes: game.cubes,
		discarded_card: game.discarded_card,
		hand: 0,
		objective: 0
	};

	if (current === "Commune") {
		view.hand = game.red_hand;
		view.objective = game.red_objective;
	}
	if (current === "Versailles") {
		view.hand = game.blue_hand;
		view.objective = game.blue_objective;
	}
	if (game.state === "game_over") {
		view.prompt = game.victory;
	} else if (current === "Observer" || (game.active_player !== current && game.active_player !== "Both")) {
		if (states[game.state]) {
			let inactive = states[game.state].inactive || game.state;
			view.prompt = `Waiting for ${game.active_player} to ${inactive}...`;
		} else {
			view.prompt = "Unknown state: " + game.state;
		}
	} else {
		view.actions = {};
		if (states[game.state])
			states[game.state].prompt(current);
		else
			view.prompt = "Unknown state: " + game.state;
		if (view.actions.undo === undefined) {
			if (game.undo && game.undo.length > 0)
				view.actions.undo = 1;
			else
				view.actions.undo = 0;
		}
	}
	return view;
}

exports.setup = function (seed, scenario, options) {
	game = {
		seed: seed,
		log: [],
		undo: [],
		active_player: "Both",
		state: "objective_card_selection",
		round: 1,
		initiative: null,
		political_vp: 0,
		military_vp: 0,
		red_momentum: 0,
		blue_momentum: 0,
		strategy_deck: [],
		objective_deck: [],
		red_hand: [34],
		red_objective: 0,
		blue_hand: [17],
		blue_objective: 0,
		discarded_card: 0,
		discs: [
			// Commune discs
			-1,
			-1,
			// Versailles discs
			-1,
			-1
		],
		spaces: spaces,
		cubes: [
			// Commune cubes
			RED_CRISIS_TRACK[0],
			RED_CRISIS_TRACK[0],
			RED_CRISIS_TRACK[0],
			RED_CRISIS_TRACK[1],
			RED_CRISIS_TRACK[1],
			RED_CRISIS_TRACK[2],
			RED_CRISIS_TRACK[2],
			RED_CRISIS_TRACK[3],
			RED_CRISIS_TRACK[3],
			RED_BONUS_CUBES[0],
			RED_BONUS_CUBES[0],
			RED_BONUS_CUBES[1],
			RED_BONUS_CUBES[1],
			RED_BONUS_CUBES[2],
			RED_BONUS_CUBES[2],
			S_PRESS,
			S_SOCIAL_MOVEMENTS,
			S_PERE_LACHAISE,
			// Versailles cubes
			BLUE_CRISIS_TRACK[0],
			BLUE_CRISIS_TRACK[1],
			BLUE_CRISIS_TRACK[1],
			BLUE_CRISIS_TRACK[2],
			BLUE_CRISIS_TRACK[3],
			BLUE_CRISIS_TRACK[3],
			BLUE_BONUS_CUBES[0],
			BLUE_BONUS_CUBES[1],
			BLUE_BONUS_CUBES[2],
			BLUE_BONUS_CUBES[2],
			BLUE_CUBE_POOL,
			BLUE_CUBE_POOL,
			BLUE_CUBE_POOL,
			BLUE_CUBE_POOL,
			BLUE_CUBE_POOL,
			BLUE_CUBE_POOL,
			S_ROYALISTS,
			S_PRESS,
		],
		operations_card: 0,
		operations_points: 0,
		operations_space_type: null,
		operations_space_scope: [],
		operations_space_id: null,
		operations_action: null,
		operations_military_strength: 0
	};
	log_h1("Red Flag Over Paris");
	log_h1("Round 1");

	for (let i = 1; i <= 41; ++i) {
		if (i !== 17 && i !== 34) {
			game.strategy_deck.push(i);
		}
	}
	for (let i = 42; i <= 53; ++i) {
		game.objective_deck.push(i);
	}
	shuffle(game.strategy_deck);
	shuffle(game.objective_deck);
	for (let i = 0; i < 4; ++i) {
		game.red_hand.push(game.strategy_deck.pop());
		game.blue_hand.push(game.strategy_deck.pop());
	}
	for (let i = 0; i < 2; ++i) {
		game.red_hand.push(game.objective_deck.pop());
		game.blue_hand.push(game.objective_deck.pop());
	}
	return game;
}

// === GAME STATES ===

states.initiative_phase = {
	inactive: "decide player order",
	prompt() {
		view.prompt = "Decide player order."
		view.actions.commune = 1
		view.actions.versailles = 1
	},
	commune() {
		log("Initiative: Commune")
		game.initiative = "Commune"
		game.active_player = game.initiative
		goto_strategy_phase()
	},
	versailles() {
		log("Initiative: Versailles")
		game.initiative = "Versailles"
		game.active_player = game.initiative
		goto_strategy_phase()
	},
}

states.objective_card_selection = {
	inactive: "choose an objective card",
	prompt(current) {
		view.prompt = "Choose an Objective card."
		for (let c of get_player_hand(current)) {
			if (is_objective_card(c)) {
				gen_action("card", c)
			}
		}
	},
	card(c, current) {
		if (current === "Commune") {
			game.red_objective = c
			game.red_hand = game.red_hand.filter(c => !is_objective_card(c))
		} else {
			game.blue_objective = c
			game.blue_hand = game.blue_hand.filter(c => !is_objective_card(c))
		}
		if (game.red_objective > 0 && game.blue_objective > 0)
			goto_initiative_phase()
		else if (game.red_objective > 0)
			game._player = "Versailles"
		else if (game.blue_objective > 0)
			game.active_player = "Commune"
		else
			game.active_player = "Both"
	},
}

states.operations_execution = {
	inactive: "execute operations",
	prompt() {
		if (game.operations_points === 0) {
			log("No operations points left");
			log("Finished operations points spending");
			clean_operations_execution();
			resume_strategy_phase();
		}
		if (game.operations_action === "check_removal_scope") {
			set_operations_space_scope();
			adjust_operations_space_scope("remove");
			if (game.operations_space_scope > 0) {
				game.operations_action = "remove";
			}
			else {
				log("No spaces available for pieces removal");
				game.operations_action = "check_placement_scope";
			}
		}
		if (game.operations_action === "check_placement_scope") {
			set_operations_space_scope();
			adjust_operations_space_scope("place");
			if (game.operations_space_scope > 0) {
				game.operations_action = "place";
			}
			else {
				log("No spaces available for pieces placement");
				log("Finished operations points spending");
				clean_operations_execution();
				resume_strategy_phase();
			}
		}
		if (game.operations_action === "remove") {
			adjust_operations_space_scope("remove");
			activate_scope_spaces();
			if (game.operations_space_scope > 0) {
				view.prompt = `Remove ${get_enemy_player()} pieces or skip`;
				view.actions.finish_pieces_removal = 1;
			}
			else {
				log("No spaces available for pieces removal");
				game.operations_action = "check_placement_scope";
			}
		}
		if (game.operations_action === "place") {
			adjust_operations_space_scope("place");
			activate_scope_spaces();
			if (game.operations_space_scope > 0) {
				view.prompt = `Place ${game.active_player} pieces or finish`;
				view.actions.finish_operations_execution = 1;
			}
			else {
				log("No spaces available for pieces placement");
				log("Finished operations points spending");
				clean_operations_execution();
				resume_strategy_phase();
			}
		}
	},
	finish_pieces_removal() {
		log("Finished pieces removal");
		game.operations_action = "check_placement_scope";
		goto_execute_operations();
	},
	finish_operations_execution() {
		log("Finished operations points spending");
		clean_operations_execution();
		resume_strategy_phase();
	},
	space(space_id) {
		push_undo();
		log(`Space selected: ${game.spaces.find(x => x.id === space_id).name}`);
		game.operations_space_id = space_id;
		if (game.operations_action === "remove") {
			goto_piece_removal();
		}
		else {
			goto_piece_placement();
		}
	},
}

states.operations_space_type_selection = {
	inactive: "choose target space type for operations",
	prompt() {
		view.prompt = "Choose target space type for operations.";
		view.actions.political = 1;
		view.actions.military = 1;
	},
	political() {
		log("Operations space type: Political");
		game.operations_space_type = "Political";
		game.operations_action = "check_removal_scope";
		goto_operations_execution();
	},
	military() {
		log("Operations space type: Military");
		game.operations_space_type = "Military";
		game.operations_action = "check_removal_scope";
		goto_operations_execution();
	},
}

states.piece_placement = {
	inactive: "place piece",
	prompt() {
		const cost = place_space_piece(game.operations_space_id);
		game.operations_points -= cost;
		log(`Piece placed for ${cost} operations point${cost > 1 ? "s" : ""}`);
		goto_operations_execution();
	}
}

states.piece_removal = {
	inactive: "remove piece",
	prompt() {
		if (game.operations_space_type === "Political") {
			remove_space_piece(game.operations_space_id);
			game.operations_points -= 1;
			log("Piece removed for 1 operations point");
			goto_operations_execution();
		}
		else {
			game.operations_military_strength = calculate_military_strength(game.operations_space_id);
			if (game.operations_military_strength >= 3) {
				const cost = remove_space_piece(game.operations_space_id);
				game.operations_points -= cost;
				log(`Piece removed for ${cost} operations point${cost > 1 ? "s" : ""}`);
				goto_operations_execution();
			}
			else {
				const operationCost = get_operation_cost(game.operations_space_id);
				if (game.operations_points - operationCost === 0) {
					evaluate_military_strength();
					goto_operations_execution();
				}
				else {
					view.prompt = `Your military strength is ${military_strength}. Do you want to spend an extra operations point?`;
					view.actions.increase_military_strength = 1;
					view.actions.evaluate_card = 1;
				}
			}
		}
	},
	increase_military_strength() {
		game.operations_points--;
		game.operations_military_strength++;
		if (game.operations_military_strength >= 3) {
			const cost = remove_space_piece(game.operations_space_id);
			game.operations_points -= cost;
			log(`Piece removed for ${cost} operations point${cost > 1 ? "s" : ""}`);
			goto_operations_execution();
		}
		else {
			evaluate_military_strength();
			goto_operations_execution();
		}
	},
	evaluate_card() {
		evaluate_military_strength();
		goto_operations_execution();
	}
}

states.strategy_phase = {
	inactive: "play a card",
	prompt() {
		view.prompt = "Play a card."
		for (let c of get_player_hand(game.active_player)) {
			if (is_strategy_card(c)) {
				if (can_play_event(c))
					gen_action("card_event", c)
				gen_action("card_ops", c)
				if (game.discarded_card > 0 && can_play_event(game.discarded_card))
					gen_action("card_use_discarded", c)
				if (can_advance_momentum())
					gen_action("card_advance_momentum", c)
			}
		}
	},
	card_event(c) {
		push_undo()
		log(`Played #${c} for event.`)
		array_remove_item(get_player_hand(game.active_player), c)
		game.discarded_card = c
		goto_play_event()
	},
	card_ops(c) {
		push_undo();
		log(`Played #${c} for ${data.cards[c].ops} ops.`);
		array_remove_item(get_player_hand(game.active_player), c);
		// game.discarded_card = c;
		game.operations_card = c;
		game.operations_points = data.cards[c].ops;
		game.state = "operations_space_type_selection";
	},
	card_advance_momentum(c) {
		push_undo()
		log(`Played #${c} to advance momentum.`)
		array_remove_item(get_player_hand(game.active_player), c)
		game.discarded_card = c
		if (game.active_player === "Commune")
			game.red_momentum += 1
		else
			game.blue_momentum += 1
		// TODO: momentum trigger
		resume_strategy_phase()
	},
	card_use_discarded(c) {
		push_undo()
		log(`Discarded #${c} to play #${game.discarded_card}.`)
		let old_c = game.discarded_card
		array_remove_item(get_player_hand(game.active_player), c)
		game.discarded_card = c
		goto_play_event(old_c)
	},
}

// === NAVIGATION ===

function goto_piece_placement() {
	game.state = "piece_placement";
}

function goto_piece_removal() {
	game.state = "piece_removal";
}

function goto_initiative_phase() {
	game.active_player = "Commune"
	game.state = "initiative_phase"
}

function goto_operations_execution() {
	game.state = "operations_execution";
}

function goto_play_event(c) {
	switch (c) {
	// TODO
	}
	resume_strategy_phase()
}

function goto_strategy_phase() {
	clear_undo()
	log_h2(game.active_player)
	game.state = "strategy_phase"
}

function resume_strategy_phase() {
	game.active_player = get_enemy_player()
	goto_strategy_phase()
}

// === LOGIC ===

function activate_scope_spaces() {
	clear_action("space");
	for (const spaceId of game.operations_space_scope) {
		gen_action("space", spaceId);
	}
}

function adjust_operations_space_scope(operations_action) {
	for (const space_id of [...game.operations_space_scope]) {
		if (game.operations_space_type === "Military" && game.discs.some((value, index) => value === space_id && get_enemy_player() === "Commune" ?
			index < 2 : index >= 2) && game.operations_points < 2) {
				game.operations_space_scope = game.operations_space_scope.filter(x => x !== space_id);
		}
		else if (operations_action === "place") {
			if (game.cubes.filter((value, index) => value === space_id && game.active_player === "Commune" ? index < 18 : index >= 18).length === 4) {
				game.operations_space_scope = game.operations_space_scope.filter(x => x !== space_id);
			}
		}
		else if (operations_action === "remove") {
			if (!game.spaces.some(x => x.id === space_id && x.presence.includes(get_enemy_player()))) {
				game.operations_space_scope = game.operations_space_scope.filter(x => x !== space_id);
			}
		}
	}
}

function calculate_military_strength(space_id) {
	let strength = 0;
	const space = game.spaces.find(x => x.id === space_id);
	for (const adjacent_space of game.spaces.filter(x => x.adjacent_to.includes(space_id))) {
		if (is_space_control(adjacent_space.id)) {
			strength++;
		}
	}
	if (space.presence.includes(game.active_player)) {
		strength++;
	}
	if (space.controlled_by === game.active_player) {
		strength++;
	}
	return strength;
}

function can_advance_momentum() {
	return game.active_player === "Commune" ? game.red_momentum < 3: game.blue_momentum < 3;
}

function can_play_event(c) {
	let side = data.cards[c].side;
	return side === game.active_player || side === "Neutral";
}

function clean_operations_execution() {
	game.discarded_card = game.operations_card;
	handle_crisis_breaches()
	game.operations_card = 0;
	game.operations_points = 0;
	game.operations_space_type = null;
	game.operations_space_scope = [];
	game.operations_space_id = null;
	game.operations_action = null;
	game.operations_military_strength = 0;
}

function evaluate_military_strength() {
	// card should be removed from the game but it will be later replaced by the strategy card played
	game.discarded_card = game.strategy_deck.pop();
	if (game.operations_military_strength >= data.cards[game.discarded_card].ops) {
		const cost = remove_space_piece(game.operations_space_id);
		game.operations_points -= cost;
		log(`Piece removed for ${cost} operations point${cost > 1 ? "s" : ""}`);
	}
	else {
		const operation_cost = get_operation_cost(game.operations_space_id);
		game.operations_points -= operation_cost;
		log(`Piece not removed. ${operation_cost} operations point${operation_cost > 1 ? "s" : ""} spent.`);
	}
}

function evaluate_space(space_id) {
	const space = game.spaces.find(x => x.id === space_id);
	const commune_pieces = game.cubes.filter((value, index) => value === space_id && index < 18).length +
		game.discs.filter((value, index) => value === space_id && index < 2).length;
	const versailles_pieces = game.cubes.filter((value, index) => value === space_id && index >= 18).length +
		game.discs.filter((value, index) => value === space_id && index >= 2).length;
	space.presence = [];
	if (commune_pieces > 0 || space.permanent_presence === "Commune") {
		space.presence.push("Commune");
	}
	if (versailles_pieces > 0 || space.permanent_presence === "Versailles") {
		space.presence.push("Versailles");
	}
	space.controlled_by = commune_pieces > versailles_pieces ? "Commune" : commune_pieces < versailles_pieces ? "Versailles" : "None";
}

function get_cube_for_placement() {
	let cube_index = -1;
	if (game.active_player === "Commune") {
		for (let i = RED_CUBE_POOL.length - 1; i >= 0; i--) {
			cube_index = game.cubes.findIndex(x => x === RED_CUBE_POOL[i]);
			if (cube_index !== -1) {
				break;
			}
		}
		if (cube_index === -1) {
			for (let i = 0; i < RED_CRISIS_TRACK.length; i++) {
				cube_index = game.cubes.findIndex(x => x === RED_CRISIS_TRACK[i]);
				if (cube_index !== -1) {
					break;
				}
			}
		}
	}
	else {
		cube_index = game.cubes.findIndex(x => x === BLUE_CUBE_POOL);
		if (cube_index === -1) {
			for (let i = 0; i < BLUE_CRISIS_TRACK.length; i++) {
				cube_index = game.cubes.findIndex(x => x === BLUE_CRISIS_TRACK[i]);
				if (cube_index !== -1) {
					break;
				}
			}
		}
	}
	return cube_index;
}

function get_enemy_player() {
	return game.active_player === "Commune" ? "Versailles" : "Commune";
}

function get_available_commune_pool() {
	let commune_pool_id = -1
	if (game.red_momentum > 0) {
		const cube_pools = RED_CUBE_POOL.slice(0, game.red_momentum);
		const cubes_count = game.cubes.filter((x, index) => index < 18 && cube_pools.includes(x));
		if (cubes_count < 2) {
			commune_pool_id = RED_CUBE_POOL[0];
		}
		else if (cubes_count < 3 && game.red_momentum > 1) {
			commune_pool_id = RED_CUBE_POOL[1];
		}
		else if (cubes_count < 4 && game.red_momentum > 2) {
			commune_pool_id = RED_CUBE_POOL[2];
		}
	}
	return commune_pool_id;
}

function get_operation_cost(space_id) {
	return game.discs.some((value, index) => value === space_id && get_enemy_player() === "Commune" ? index < 2 : index >= 2) ? 2 : 1;
}

function get_player_hand(current) {
	return current === "Commune" ? game.red_hand : game.blue_hand;
}

function is_objective_card(c) {
	return c >= 42 && c <= 53;
}

function is_space_presence(space_id) {
	return game.spaces.some(x => x.id === space_id && x.presence.includes(game.active_player));
}

function is_space_control(space_id) {
	return game.spaces.some(x => x.id === space_id && x.controlled_by === game.active_player);
}

function is_strategy_card(c) {
	return !is_objective_card(c) && c !== 17 && c !== 34;
}

function handle_crisis_breaches() {
	for (const crisis_zone of crisis_zones.filter(x => x.player === game.active_player && x.is_breachable)) {
		if (crisis_zone.size > game.cubes.filter(x => x === crisis_zone.id).length && game.cubes.some(x => x === crisis_zone.bonus_area)) {
			for (const bonus_cube of game.cubes.filter(x => x === crisis_zone.bonus_area)) {
				if (crisis_zone.player === "Commune") {
					const commune_pool_id = get_available_commune_pool();
					bonus_cube = commune_pool_id;
				}
				else {
					bonus_cube = BLUE_CUBE_POOL;
				}
			}
			if (crisis_zone.name === "Final Crisis") {
				const enemy_final_crisis = crisis_zones.find(x => x.name === crisis_zone.name && x.player !== crisis_zone.player);
				if (enemy_final_crisis.size === game.cubes.filter(x => x === enemy_final_crisis.id).length) {
					// TODO: adjust game.political_vp
					for (const enemy_bonus_cube of game.cubes.filter(x => x === enemy_final_crisis.id)) {
						enemy_bonus_cube = -1;
					}
				}
			}
		}
	}
}

function place_space_piece(space_id) {
	let cost = 0;
	const cube_index = get_cube_for_placement();
	if (cube_index !== -1) {
		game.cubes[cube_index] = space_id;
		cost = game.discs.some((value, index) => value === space_id && get_enemy_player() === "Commune" ? index < 2 : index >= 2) ? 2 : 1;
		evaluate_space(space_id);
	}
	return cost;
}

function remove_space_piece(space_id) {
	let cost = 0;
	const cube_index = game.cubes.findIndex((value, index) => value === space_id && get_enemy_player() === "Commune" ? index < 18 : index >= 18);
	const disc_index = game.discs.findIndex((value, index) => value === space_id && get_enemy_player() === "Commune" ? index < 2 : index >= 2);
	if (cube_index !== -1) {
		if (get_enemy_player() === "Commune") {
			const commune_pool_id = get_available_commune_pool();
			game.cubes[cube_index] = commune_pool_id;
		}
		else {
			game.cubes[cube_index] = BLUE_CUBE_POOL;
		}
		cost = disc_index !== -1 ? 2 : 1;
	}
	else {
		game.discs[disc_index] = -1;
		cost = 2;
	}
	evaluate_space(space_id);
	return cost;
}

function set_operations_space_scope() {
	game.operations_space_scope = [];
	for (const space of game.spaces) {
		if (is_space_presence(space.id)) {
			game.operations_space_scope.push(space.id);
			continue;
		}
		for (const linked_space of space.adjacent_to) {
			if (is_space_control(linked_space.id)) {
				game.operations_space_scope.push(space.id);
				break;
			}
		}
	}
}

// === COMMON LIBRARY ===

function clear_action(action) {
	view.actions[action] = [];
}

function gen_action(action, argument) {
	if (argument !== undefined) {
		if (!(action in view.actions)) {
			view.actions[action] = [];
		}
		set_add(view.actions[action], argument);
	} else {
		view.actions[action] = 1;
	}
}

function remove_action(action, argument) {
	if (argument !== undefined) {
		if (action in view.actions) {
			set_delete(view.actions[action], argument);
		}
	}
}

function random(range) {
	// An MLCG using integer arithmetic with doubles.
	// https://www.ams.org/journals/mcom/1999-68-225/S0025-5718-99-00996-5/S0025-5718-99-00996-5.pdf
	// m = 2**35 − 31
	return (game.seed = game.seed * 200105 % 34359738337) % range
}

function shuffle(list) {
	for (let i = list.length - 1; i > 0; --i) {
		let j = random(i + 1)
		let tmp = list[j]
		list[j] = list[i]
		list[i] = tmp
	}
}

// remove item at index (faster than splice)
function array_remove(array, index) {
	let n = array.length
	for (let i = index + 1; i < n; ++i)
		array[i - 1] = array[i]
	array.length = n - 1
	return array
}

// insert item at index (faster than splice)
function array_insert(array, index, item) {
	for (let i = array.length; i > index; --i)
		array[i] = array[i - 1]
	array[index] = item
	return array
}

function array_remove_item(array, item) {
	let i = array.indexOf(item)
	if (i >= 0)
		array_remove(array, i)
}

function set_clear(set) {
	set.length = 0
}

function set_has(set, item) {
	let a = 0
	let b = set.length - 1
	while (a <= b) {
		let m = (a + b) >> 1
		let x = set[m]
		if (item < x)
			b = m - 1
		else if (item > x)
			a = m + 1
		else
			return true
	}
	return false
}

function set_add(set, item) {
	let a = 0
	let b = set.length - 1
	while (a <= b) {
		let m = (a + b) >> 1
		let x = set[m]
		if (item < x)
			b = m - 1
		else if (item > x)
			a = m + 1
		else
			return set
	}
	return array_insert(set, a, item)
}

function set_delete(set, item) {
	let a = 0
	let b = set.length - 1
	while (a <= b) {
		let m = (a + b) >> 1
		let x = set[m]
		if (item < x)
			b = m - 1
		else if (item > x)
			a = m + 1
		else
			return array_remove(set, m)
	}
	return set
}

function set_toggle(set, item) {
	let a = 0
	let b = set.length - 1
	while (a <= b) {
		let m = (a + b) >> 1
		let x = set[m]
		if (item < x)
			b = m - 1
		else if (item > x)
			a = m + 1
		else
			return array_remove(set, m)
	}
	return array_insert(set, a, item)
}


// Fast deep copy for objects without cycles
function object_copy(original) {
	if (Array.isArray(original)) {
		let n = original.length
		let copy = new Array(n)
		for (let i = 0; i < n; ++i) {
			let v = original[i]
			if (typeof v === "object" && v !== null)
				copy[i] = object_copy(v)
			else
				copy[i] = v
		}
		return copy
	} else {
		let copy = {}
		for (let i in original) {
			let v = original[i]
			if (typeof v === "object" && v !== null)
				copy[i] = object_copy(v)
			else
				copy[i] = v
		}
		return copy
	}
}

function clear_undo() {
	if (game.undo.length > 0)
		game.undo = []
}

function push_undo() {
	let copy = {}
	for (let k in game) {
		let v = game[k]
		if (k === "undo")
			continue
		else if (k === "log")
			v = v.length
		else if (typeof v === "object" && v !== null)
			v = object_copy(v)
		copy[k] = v
	}
	game.undo.push(copy)
}

function pop_undo() {
	let save_log = game.log
	let save_undo = game.undo
	game = save_undo.pop()
	save_log.length = game.log
	game.log = save_log
	game.undo = save_undo
}

function log(msg) {
	game.log.push(msg)
}

function log_br() {
	if (game.log.length > 0 && game.log[game.log.length-1] !== "")
		game.log.push("")
}

function logi(msg) {
	game.log.push(">" + msg)
}

function log_h1(msg) {
	log_br()
	log(".h1 " + msg)
	log_br()
}

function log_h2(msg) {
	log_br()
	log(".h2 " + msg)
	log_br()
}
