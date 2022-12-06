"use strict"

const space_count = data.space_names.length

let layout = []
let space_layout_cube = []
let space_layout_disc = []

let ui = {
	cards: [ null ],
	cubes: [],
	discs: [],
	spaces: [],
	red_momentum: document.getElementById("red_momentum"),
	blue_momentum: document.getElementById("blue_momentum"),
	political_vp: document.getElementById("political_vp"),
	military_vp: document.getElementById("military_vp"),
	round_marker: document.getElementById("round_marker"),
}

// :r !python3 tools/genboxes.py
const boxes = {
	"Royalists": [318,1711,506,505],
	"Republicans": [1960,1712,504,504],
	"Catholic Church": [318,3146,505,505],
	"Social Movements": [1960,3146,506,505],
	"Fort d'Issy": [3374,3172,506,506],
	"Butte-Aux-Cailles": [4153,2642,505,505],
	"Père Lachaise": [4824,2364,506,505],
	"Château de Vincennes": [5369,2599,504,507],
	"Press": [1176,2908,447,448],
	"National Assembly": [1168,1984,447,447],
	"Butte Montmartre": [4208,1842,447,444],
	"Mont-Valérien": [2868,2028,447,448],
	"Versailles HQ": [2646,3398,404,380],
	"Prussian Occupied Territory": [5190,1413,718,346],
	"Red Crisis Track Start": [3928,244,361,448],
	"Red Crisis Track Escalation": [4289,244,334,448],
	"Red Crisis Track Tension": [4623,244,332,448],
	"Red Crisis Track Final Crisis": [4955,244,332,448],
	"Blue Crisis Track Start": [1728,244,354,446],
	"Blue Crisis Track Escalation": [1394,244,334,446],
	"Blue Crisis Track Tension": [1061,244,333,446],
	"Blue Crisis Track Final Crisis": [728,244,333,446],
	"Blue Objective Card": [479,3983,1088,218],
	"Red Objective Card": [4454,3984,1088,218],
	"Red Cube Pool": [4498,790,791,219],
	"Blue Cube Pool": [720,790,791,219],
	"Red Bonus Cubes 1": [4289,89,334,155],
	"Red Bonus Cubes 2": [4623,89,332,155],
	"Red Bonus Cubes 3": [4955,89,332,155],
	"Blue Bonus Cubes 1": [1394,89,334,155],
	"Blue Bonus Cubes 2": [1061,89,333,155],
	"Blue Bonus Cubes 3": [728,89,333,155],
	"Red Pool 1": [3149,1319,461,157],
	"Red Pool 2": [3610,1319,543,157],
	"Red Pool 3": [4154,1319,629,157],
}

function is_card_action(action, card) {
	if (view.actions && view.actions[action] && view.actions[action].includes(card))
		return true
	return false
}

function is_cube_action(i) {
	if (view.actions && view.actions.cube && view.actions.cube.includes(i))
		return true
	return false
}

function is_disc_action(i) {
	if (view.actions && view.actions.disc && view.actions.disc.includes(i))
		return true
	return false
}

function is_space_action(i) {
	if (view.actions && view.actions.space && view.actions.space.includes(i))
		return true
	return false
}

function on_blur(evt) {
	document.getElementById("status").textContent = ""
}

function on_focus_space(evt) {
	document.getElementById("status").textContent = evt.target.my_name
}

function on_click_space(evt) {
	if (evt.button === 0) {
		if (send_action('space', evt.target.my_space))
			evt.stopPropagation()
	}
}

function on_click_cube(evt) {
	if (evt.button === 0) {
		if (send_action('cube', evt.target.my_cube))
			evt.stopPropagation()
	}
}

function on_click_disc(evt) {
	if (evt.button === 0) {
		if (send_action('disc', evt.target.my_disc))
			evt.stopPropagation()
	}
}

function build_user_interface() {
	let elt

	for (let c = 1; c <= 41 + 12; ++c) {
		elt = ui.cards[c] = document.createElement("div")
		elt.className = `card card_${c}`
		elt.my_card = c
		elt.addEventListener("click", on_click_card)
	}

	for (let i = 0; i < 36; ++i) {
		elt = ui.cubes[i] = document.createElement("div")
		if (i < 18)
			elt.className = "piece cube red"
		else
			elt.className = "piece cube blue"
		elt.my_cube = i
		elt.addEventListener("mousedown", on_click_cube)
		document.getElementById("pieces").appendChild(elt)
	}

	for (let i = 0; i < 4; ++i) {
		elt = ui.discs[i] = document.createElement("div")
		if (i < 2)
			elt.className = "piece disc red"
		else
			elt.className = "piece disc blue"
		elt.my_disc = i
		elt.addEventListener("mousedown", on_click_disc)
	}

	for (let i = 0; i < space_count; ++i) {
		let name = data.space_names[i]
		let r = boxes[name]
		elt = ui.spaces[i] = document.createElement("div")
		elt.className = "space"
		elt.my_space = i
		elt.my_name = name
		elt.addEventListener("mousedown", on_click_space)
		elt.addEventListener("mouseenter", on_focus_space)
		elt.addEventListener("mouseleave", on_blur)
		let bw = 8
		let x = Math.round(r[0] / 4)
		let y = Math.round(r[1] / 4)
		let w = Math.round(r[2] / 4)
		let h = Math.round(r[3] / 4)
		elt.style.top = y + "px"
		elt.style.left = x + "px"
		elt.style.width = (w - bw * 2) + "px"
		elt.style.height = (h - bw * 2) + "px"
		space_layout_cube[i] = { x: x + Math.round(w/2), y: y + Math.round(h*1/2) }
		space_layout_disc[i] = { x: x + w, y: y + h }
		document.getElementById("spaces").appendChild(elt)
	}
}

function layout_cubes(list, xorig, yorig) {
	const dx = 20
	const dy = 11
	if (list.length > 0) {
		let ncol = Math.round(Math.sqrt(list.length))
		let nrow = Math.ceil(list.length / ncol)
		function place_cube(row, col, e, z) {
			let x = xorig - (row * dx - col * dx) - 18 + (nrow-ncol) * 6
			let y = yorig - (row * dy + col * dy) - 28 + (nrow-1) * 8
			e.style.left = x + "px"
			e.style.top = y + "px"
			e.style.zIndex = z
		}
		let z = 50
		let i = 0
		for (let row = 0; row < nrow; ++row)
			for (let col = 0; col < ncol && i < list.length; ++col)
				place_cube(row, col, list[list.length-(++i)], z--)
	}
}

function layout_disc(s, disc) {
	if (s > 0)
		disc.classList.remove("hide")
	else
		disc.classList.add("hide")
	disc.style.left = (space_layout_disc[s].x - 50 - 12) + "px"
	disc.style.top = (space_layout_disc[s].y - 20 - 8) + "px"
}

function on_focus_card_tip(card_number) {
	document.getElementById("tooltip").className = "card card_" + card_number
}

function on_blur_card_tip() {
	document.getElementById("tooltip").classList = "card hide"
}

function sub_card_name(match, p1, offset, string) {
	let c = p1 | 0
	let n = data.cards[c].name
	return `<span class="tip" onmouseenter="on_focus_card_tip(${c})" onmouseleave="on_blur_card_tip()">${n}</span>`
}

function on_log(text) {
	let p = document.createElement("div")

	if (text.match(/^>/)) {
		text = text.substring(1)
		p.className = 'i'
	}

	text = text.replace(/&/g, "&amp;")
	text = text.replace(/</g, "&lt;")
	text = text.replace(/>/g, "&gt;")
	text = text.replace(/#(\d+)/g, sub_card_name)

	if (text.match(/^\.h1/)) {
		text = text.substring(4)
		p.className = 'h1'
	}

	if (text.match(/^\.h2/)) {
		text = text.substring(4)
		if (text === 'Commune')
			p.className = 'h2 commune'
		else if (text === 'Versailles')
			p.className = 'h2 versailles'
		else
			p.className = 'h2'
	}

	p.innerHTML = text
	return p
}

function on_update() {
	if (view.active_card)
		document.getElementById("active_card").className = `card card_${view.active_card}`
	else
		document.getElementById("active_card").className = `card card_strategy_back`

	if (view.initiative === "Commune")
		document.getElementById("commune_info").textContent = "\u2756"
	else
		document.getElementById("commune_info").textContent = ""
	if (view.initiative === "Versailles")
		document.getElementById("versailles_info").textContent = "\u2756"
	else
		document.getElementById("versailles_info").textContent = ""

	ui.round_marker.className = `piece pawn round${view.round}`
	ui.red_momentum.className = `piece cylinder red m${view.red_momentum}`
	ui.blue_momentum.className = `piece cylinder blue m${view.blue_momentum}`
	ui.military_vp.className = `piece cylinder purple vp${5+view.military_vp}`
	ui.political_vp.className = `piece cylinder orange vp${5+view.political_vp}`

	document.getElementById("hand").replaceChildren()
	if (view.objective)
		document.getElementById("hand").appendChild(ui.cards[view.objective])
	if (view.hand)
		for (let c of view.hand)
			document.getElementById("hand").appendChild(ui.cards[c])

	for (let i = 0; i < space_count; ++i)
		layout[i] = []
	for (let i = 0; i < 36; ++i) {
		layout[view.cubes[i]].push(ui.cubes[i])
		ui.cubes[i].classList.toggle("action", is_cube_action(i))
	}
	for (let i = 0; i < space_count; ++i) {
		layout_cubes(layout[i], space_layout_cube[i].x, space_layout_cube[i].y)
		ui.spaces[i].classList.toggle("action", is_space_action(i))
	}
	for (let i = 0; i < 4; ++i) {
		layout_disc(view.discs[i], ui.discs[i])
		ui.discs[i].classList.toggle("action", is_cube_action(i))
	}

	for (let i = 1; i < ui.cards.length; ++i) {
		ui.cards[i].classList.toggle("action", is_card_action('card', i))
	}

	action_button("commune", "Commune")
	action_button("versailles", "Versailles")
	action_button("undo", "Undo")
}

/* CARD ACTION MENU */

let current_popup_card = 0

function show_popup_menu(evt, list) {
	document.querySelectorAll("#popup div").forEach(e => e.classList.remove('enabled'))
	for (let item of list) {
		let e = document.getElementById("menu_" + item)
		e.classList.add('enabled')
	}
	let popup = document.getElementById("popup")
	popup.style.display = 'block'
	popup.style.left = (evt.clientX-50) + "px"
	popup.style.top = (evt.clientY-12) + "px"
	ui.cards[current_popup_card].classList.add("selected")
}

function hide_popup_menu() {
	let popup = document.getElementById("popup")
	popup.style.display = 'none'
	if (current_popup_card) {
		ui.cards[current_popup_card].classList.remove("selected")
		current_popup_card = 0
	}
}

function on_card_event() {
	if (send_action('card_event', current_popup_card))
		hide_popup_menu()
}

function on_card_ops() {
	if (send_action('card_ops', current_popup_card))
		hide_popup_menu()
}

function on_card_use_discarded() {
	if (send_action('card_use_discarded', current_popup_card))
		hide_popup_menu()
}

function on_card_advance_momentum() {
	if (send_action('card_advance_momentum', current_popup_card))
		hide_popup_menu()
}

function on_click_card(evt) {
	if (evt.button === 0) {
		if (view.actions) {
			let card = evt.target.my_card
			if (is_card_action('card', card)) {
				send_action('card', card)
			} else {
				let menu = []
				if (is_card_action('card_event', card))
					menu.push('card_event')
				if (is_card_action('card_ops', card))
					menu.push('card_ops')
				if (is_card_action('card_use_discarded', card))
					menu.push('card_use_discarded')
				if (is_card_action('card_advance_momentum', card))
					menu.push('card_advance_momentum')
				if (menu.length > 0) {
					current_popup_card = card
					show_popup_menu(evt, menu)
				}
			}
		}
	}
}

build_user_interface()
scroll_with_middle_mouse("main")
