runAstroScript(() => {
	const $ = document.querySelector.bind(document);
	const $$ = document.querySelectorAll.bind(document);
	const dce = document.createElement.bind(document);
	const c = dce("canvas");
	const ctx = c.getContext("2d");
	c.id = "canvas-video-mask";


	let intervalId = null;
	$$(".shape-button").forEach((button) => {
		button.addEventListener("click", () => {
			$("#shape").value = button.dataset.shape;
		});
	});

	$("[data-shape='star']").focus();

	const createVideo = (src) => {
		const video = dce("video");
		video.id = "player";
		video.muted = true;
		video.setAttribute("loop", "true");
		video.setAttribute("playsinline", "true");
		video.setAttribute("autoplay", "true");
		video.style.display = "none";
		video.innerHTML = `<source src="${src}" type="video/mp4" />`;
		return video;
	};

	const makePlayer = () => {
		const video = createVideo("/assets/postcode/canvas-video-grid/ddd.mp4");
		const container = $("#container");
		if (!container) return;
		container.appendChild(video);
		container.appendChild(c);
		video.addEventListener(
			"loadedmetadata",
			function () {
				intervalId = setInterval(draw.bind(this), 10);
			},
			false
		);
		video.play();
	};

	const draw = () => {
		if (typeof path === 'undefined') return;
		const video = $("#player");
		if (
			!(video instanceof HTMLVideoElement) ||
			!(c instanceof HTMLCanvasElement)
		)
			return;
		var w = video.videoWidth;
		var h = video.videoHeight;
		var segments = 5;
		var gw = Math.floor(w / segments);
		var gh = Math.floor(h / segments);
		c.width = 800;
		c.height = 480;
		const shapeWidth = 400;
		ctx.clearRect(0, 0, w, h);
		const shape = $("#shape").value;
		let p;
		const cx = c.width / 2;
		const cy = c.height / 2;
		switch (shape) {
			case "star":
				p = new path().star(450, 200, 5, c.width / 2, c.height / 2);
				break;
			case "ellipse":
				p = new path().ellipse(shapeWidth, 480, cx, cy);
				break;
			case "regPolygon":
				p = new path().regPolygon(450, 5, cx, cy);
				break;
			case "x":
				const numPoints = 8;
				const points = path.radialPoints(225, cx, cy, numPoints);
				const innerPoints = path.radialPoints(0, cx, cy, numPoints);
				p = new path().M(innerPoints[0][0], innerPoints[0][1]);
				for (let i = 0; i < numPoints; i += 2) {
					p = p
						.L(points[i][0], points[i][1])
						.L(points[i + 1][0], points[i + 1][1])
						.L(innerPoints[i + 1][0], innerPoints[i + 1][1])
						.L(
							innerPoints[(i + 2) % numPoints][0],
							innerPoints[(i + 2) % numPoints][1]
						);
				}
				break;
		}
		// Matrix transformation
		const region = new Path2D(p.toString());
		ctx.translate(cx, cy);
		// convert video time to radians from 0 to total time of video
		// so that we do three rotations in the time of the video
		const radians = (video.currentTime * Math.PI * 3) / video.duration;
		ctx.rotate(radians);
		ctx.translate(-cx, -cy);
		ctx.clip(region);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.drawImage(video, 0, 0, c.width, c.height);
	};


	const cancelAnimation = () => {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
	};

	makePlayer();
	return cancelAnimation;
});