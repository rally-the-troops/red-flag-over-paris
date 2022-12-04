"use strict"

// TODO: change active_card to explicit discard pile ?

const data = require("./data")

const RED_CUBE_POOL = 0
const RED_CRISIS_TRACK = [1, 2, 3, 4]
const RED_BONUS_CUBES = [ 5, 6, 7 ]
const BLUE_CUBE_POOL = 8
const BLUE_CRISIS_TRACK = [9, 10, 11, 12]
const BLUE_BONUS_CUBES = [ 13, 14, 15 ]
const S_ROYALISTS = 16
const S_NATIONAL_ASSEMBLY = 17
const S_REPUBLICANS = 18
const S_CATHOLIC_CHURCH = 19
const S_PRESS = 20
const S_SOCIAL_MOVEMENTS = 21
const S_MONT_VALERIEN = 22
const S_BUTTE_MONTMARTRE = 23
const S_FORT_D_ISSY = 24
const S_BUTTE_AUX_CAILLES = 25
const S_PERE_LACHAISE = 26
const S_CHATEAU_DE_VINCENNES = 27
const S_PRUSSIAN_OCCUPIED_TERRITORY = 28
const S_VERSAILLES_HQ = 29

var game, view

var states = {}

exports.scenarios = [ "Standard", "Censorship" ]

exports.roles = [ "Commune", "Versailles" ]

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
		game.active = null
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
	game = state

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

		discs: game.discs,
		cubes: game.cubes,

		active_card: game.active_card,
		hand: 0,
		objective: 0
	}

	if (current === "Commune") {
		view.hand = game.red_hand
		view.objective = game.red_objective
	}
	if (current === "Versailles") {
		view.hand = game.blue_hand
		view.objective = game.blue_objective
	}

	if (game.state === "game_over") {
		view.prompt = game.victory
	} else if (current === "Observer" || (game.active !== current && game.active !== "Both")) {
		if (states[game.state]) {
			let inactive = states[game.state].inactive || game.state
			view.prompt = `Waiting for ${game.active} to ${inactive}...`
		} else {
			view.prompt = "Unknown state: " + game.state
		}
	} else {
		view.actions = {}
		if (states[game.state])
			states[game.state].prompt(current)
		else
			view.prompt = "Unknown state: " + game.state
		if (view.actions.undo === undefined) {
			if (game.undo && game.undo.length > 0)
				view.actions.undo = 1
			else
				view.actions.undo = 0
		}
	}

	return view
}

exports.setup = function (seed, scenario, options) {
	game = {
		seed: seed,
		scenario: scenario,
		log: [],
		undo: [],
		active: "Both",
		state: "choose_objective_card",

		round: 1,
		initiative: null,
		political_vp: 0,
		military_vp: 0,
		red_momentum: 0,
		blue_momentum: 0,

		strategy_deck: [],
		objective_deck: [],

		red_hand: [ 34 ],
		red_objective: 0,
		blue_hand: [ 17 ],
		blue_objective: 0,

		cubes: [
			// red cubes
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

			// blue cubes
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

		discs: [ 0, 0, 0, 0 ],

		active_card: 0,
		count: 0,
	}

	log_h1("Red Flag Over Paris")

	if (game.scenario !== "Standard")
		log(game.scenario)

	log_h1("Round 1")

	for (let i = 1; i <= 41; ++i)
		if (i !== 17 && i !== 34)
			game.strategy_deck.push(i)

	for (let i = 42; i <= 53; ++i)
		game.objective_deck.push(i)

	shuffle(game.strategy_deck)
	shuffle(game.objective_deck)

	let n = 4
	if (game.scenario === "Censorship")
		n = 5

	for (let i = 0; i < n; ++i) {
		game.red_hand.push(game.strategy_deck.pop())
		game.blue_hand.push(game.strategy_deck.pop())
	}

	for (let i = 0; i < 2; ++i) {
		game.red_hand.push(game.objective_deck.pop())
		game.blue_hand.push(game.objective_deck.pop())
	}

	return game
}

// === GAME STATES ===

function discard_card(c) {
	array_remove_item(player_hand(game.active), c)
	game.active_card = c
}

function recycle_card(c) {
	array_remove_item(player_hand(game.active), c)
	game.strategy_deck.unshift(c)
}

function is_objective_card(c) {
	return c >= 42 && c <= 53
}

function is_strategy_card(c) {
	return !is_objective_card(c) && c !== 17 && c !== 34
}

function enemy_player() {
	if (game.active === "Commune")
		return "Versailles"
	return "Commune"
}

function player_hand(current) {
	if (current === "Commune")
		return game.red_hand
	return game.blue_hand
}

function can_play_event(c) {
	let side = data.cards[c].side
	if (side === game.active || side === "Neutral")
		return true
	return false
}

function can_advance_momentum() {
	if (game.active === "Commune")
		return game.red_momentum < 3
	return game.blue_momentum < 3
}

// === CHOOSE OBJECTIVE CARD ===

states.choose_objective_card = {
	inactive: "choose an objective card",
	prompt(current) {
		view.prompt = "Choose an Objective card."
		for (let c of player_hand(current)) {
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
			end_choose_objective_card()
		else if (game.red_objective > 0)
			game.active = "Versailles"
		else if (game.blue_objective > 0)
			game.active = "Commune"
		else
			game.active = "Both"
	},
}

function end_choose_objective_card() {
	goto_initiative_phase()
}

// === INITIATIVE PHASE ===

function goto_initiative_phase() {
	game.active = "Commune"
	game.state = "initiative_phase"
}

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
		end_initiative_phase()
	},
	versailles() {
		log("Initiative: Versailles")
		game.initiative = "Versailles"
		end_initiative_phase()
	},
}

function end_initiative_phase() {
	game.active = game.initiative
	if (game.scenario === "Censorship")
		goto_censorship_phase()
	else
		goto_strategy_phase()
}

// === CENSORSHIP PHASE ===

function goto_censorship_phase() {
	game.state = "censorship_phase"
}

states.censorship_phase = {
	inactive: "censorship phase",
	prompt() {
		view.prompt = "Discard a card from your hand."
		for (let c of player_hand(game.active))
			if (is_strategy_card(c))
				gen_action("card", c)
	},
	card(c) {
		log(`Discarded #${c}.`)
		discard_card(c)
		if (game.active === game.initiative)
			game.active = enemy_player()
		else
			goto_strategy_phase()
	},
}

// === PLAYING STRATEGY CARDS ===

function goto_strategy_phase() {
	clear_undo()
	log_h2(game.active)
	game.state = "strategy_phase"
}

function resume_strategy_phase() {
	game.active = enemy_player()
	goto_strategy_phase()
}

states.strategy_phase = {
	inactive: "play a card",
	prompt() {
		view.prompt = "Play a card."
		for (let c of player_hand(game.active)) {
			console.log(game.active, "hand", c)
			if (is_strategy_card(c)) {
				if (can_play_event(c))
					gen_action("card_event", c)
				gen_action("card_ops", c)
				if (game.active_card > 0 && can_play_event(game.active_card))
					gen_action("card_use_discarded", c)
				if (can_advance_momentum())
					gen_action("card_advance_momentum", c)
			}
		}
	},
	card_event(c) {
		push_undo()
		log(`Played #${c} for event.`)
		discard_card(c)
		goto_play_event()
	},
	card_ops(c) {
		push_undo()
		log(`Played #${c} for ${data.cards[c].ops} ops.`)
		discard_card(c)
		game.count = data.cards[c].ops
		game.state = "operations"
	},
	card_advance_momentum(c) {
		push_undo()
		log(`Played #${c} to advance momentum.`)
		if (game.scenario === "Censorship")
			recycle_card(c)
		else
			discard_card(c)
		if (game.active === "Commune")
			game.red_momentum += 1
		else
			game.blue_momentum += 1
		// TODO: momentum trigger
		resume_strategy_phase()
	},
	card_use_discarded(c) {
		push_undo()
		log(`Discarded #${c} to play #${game.active_card}.`)
		let old_c = game.active_card
		discard_card(c)
		goto_play_event(old_c)
	},
}

function goto_play_event(c) {
	switch (c) {
	// TODO
	}
	resume_strategy_phase()
}

// === COMMON LIBRARY ===

function gen_action(action, argument) {
	if (argument !== undefined) {
		if (!(action in view.actions))
			view.actions[action] = []
		set_add(view.actions[action], argument)
	} else {
		view.actions[action] = 1
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
