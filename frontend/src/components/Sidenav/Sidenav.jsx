import { useLayoutEffect, useState, createContext } from "react";
import PropTypes from "prop-types";

import { MaxNav } from "./MaxNav/MaxNav";
import { MinNav } from "./MinNav/MinNav";

import { useSpring, useTrail, useSpringRef, useChain, useTransition } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

import { minSidenavOptions, maxSidenavOptions as maxNavOptions } from "./sidenavOptions";

import "./Sidenav.scss";

const Sidenav = ({ isNavOpen, setIsNavOpen }) => {
	const [activeOption, setActiveOption] = useState("messages");
	const [activeOptionsList, setActiveOptionsList] = useState(maxNavOptions[activeOption]);

	useLayoutEffect(() => {
		setActiveOptionsList(maxNavOptions[activeOption]);
	}, [activeOption]);

	// Animation - Fade in active options list (MaxNav)
	const activeOptionsListRef = useSpringRef();
	const activeOptionsListAnim = useTransition(activeOptionsList, {
		from: { opacity: 0, y: -5 },
		enter: { opacity: 1, y: 0 },
		trail: 150 / activeOptionsList.length,
		// reset: true,
		config: { duration: 150 },
		ref: activeOptionsListRef,
	});

	// Animation - Fade in icons (on render)
	const rainIconsRef = useSpringRef();
	const rainIcons = useTrail(minSidenavOptions.length + 2, {
		ref: rainIconsRef,
		from: { opacity: 0, y: -20 },
		to: { opacity: 1, y: 0 },
	});

	// Animation - Slide in nav, for min nav (on click)
	const minNavSlideRef = useSpringRef();
	const minNavSlide = useSpring({
		ref: minNavSlideRef,
		from: { x: "-100%" },
		to: { x: "0%" },
	});

	// Animation - Slide in nav, for max nav (on click)
	const maxNavSlideRef = useSpringRef();
	const [maxNavSlide, maxNavSlideApi] = useSpring(() => ({
		ref: maxNavSlideRef,
		from: { x: "-150%" },
		to: { x: "0%" },
	}));

	const bind = useDrag(({ down, movement: [mx] }) => {
		mx = (mx / window.innerWidth) * 500;
		const clampedX = Math.max(Math.min(mx, 0), -150);
		maxNavSlideApi.start({
			x: down ? `${clampedX}%` : isNavOpen ? "0%" : "-150%",
			immediate: down,
			config: { tension: 500, friction: 50 },
			clamp: true,
			touchAction: "none",
			onResolve: () => {
				setIsNavOpen(clampedX > -75);
			},
		});
	});

	function slideNav() {
		maxNavSlideApi.start({
			to: { x: isNavOpen ? "-150%" : "0%" },
		});
		setIsNavOpen(!isNavOpen);
	}

	useChain([minNavSlideRef, rainIconsRef, maxNavSlideRef, activeOptionsListRef], [0.2, 0.5, 0.8, 0.25], 500);

	return (
		<div className={"sidenav-container " + (isNavOpen ? "open" : "close")}>
			<MinNav
				rainIcons={rainIcons}
				slideNav={slideNav}
				minNavSlide={minNavSlide}
				sidenavOptions={minSidenavOptions}
				setActiveOption={setActiveOption}
			/>
			<MaxNav
				maxNavSlide={maxNavSlide}
				activeOption={activeOption}
				activeOptionsList={activeOptionsListAnim}
				isNavOpen={isNavOpen}
				slideNav={slideNav}
				bind={bind}
			/>
		</div>
	);
};

// PropTypes
Sidenav.propTypes = {
	selectedOption: PropTypes.string,
};

export { Sidenav };
