convert "HIRES/map.jpg" -colorspace RGB -resize 25% -colorspace sRGB map75.png
convert "HIRES/map.jpg" -colorspace RGB -resize 33.333333% -colorspace sRGB map100.png
convert "HIRES/map.jpg" -colorspace RGB -resize 50% -colorspace sRGB map150.png
convert "HIRES/map.jpg" -colorspace RGB -resize 66.666667% -colorspace sRGB map200.png

for I in $(seq 41)
do
	convert "HIRES/Strat/Strategy_RedFlag Carda 1_48-$I copy.jpg" \
		-colorspace RGB -resize 33.333333% -colorspace sRGB cards.1x/card_$I.png
	convert "HIRES/Strat/Strategy_RedFlag Carda 1_48-$I copy.jpg" \
		-colorspace RGB -resize 66.666667% -colorspace sRGB cards.2x/card_$I.png
done

for I in $(seq 12)
do
	X=$(expr $I + 41)
	convert "HIRES/obj/objectives-$I copy.jpg" \
		-colorspace RGB -resize 33.333333% -colorspace sRGB cards.1x/card_$X.png
	convert "HIRES/obj/objectives-$I copy.jpg" \
		-colorspace RGB -resize 66.666667% -colorspace sRGB cards.2x/card_$X.png
done

convert "HIRES/obj/Back_objectives-13 copy.jpg" \
		-colorspace RGB -resize 33.333333% -colorspace sRGB cards.1x/card_objective_back.png
convert "HIRES/obj/Back_objectives-13 copy.jpg" \
		-colorspace RGB -resize 66.666667% -colorspace sRGB cards.2x/card_objective_back.png
convert "HIRES/Strat/Back_Strategy_RedFlag Carda 1_48-42 copy.jpg" \
		-colorspace RGB -resize 33.333333% -colorspace sRGB cards.1x/card_strategy_back.png
convert "HIRES/Strat/Back_Strategy_RedFlag Carda 1_48-42 copy.jpg" \
		-colorspace RGB -resize 66.666667% -colorspace sRGB cards.2x/card_strategy_back.png
