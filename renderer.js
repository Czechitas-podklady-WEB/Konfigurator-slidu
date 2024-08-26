export const renderer = (onUrlChange) => {
	const $canvas = document.createElement('canvas')
	$canvas.style.display = 'none'
	document.body.appendChild($canvas)

	const width = 1920
	const height = 1080
	$canvas.width = width
	$canvas.height = height
	const fontFamily = 'Open Sans'
	const context = $canvas.getContext('2d')
	const iconImage = new Image()
	iconImage.crossOrigin = 'anonymous'
	const backgroundImage = new Image(width, height)
	backgroundImage.src = 'background.png'
	let parameters = {}

	backgroundImage.addEventListener('load', () => {
		render(parameters)
	})

	document.fonts.ready.then(function () {
		if (document.fonts.check(`1em ${fontFamily}`)) {
			render(parameters)
		}
	})

	const setFont = (size, isBold) => {
		context.font = `${
			isBold ? 'bold' : 'normal'
		} ${size}px ${fontFamily}, sans-serif`
	}

	const renderMultiline = (text, lineHeight, alignTop, x, y) =>
		text.split('\n').forEach((line, i, lines) => {
			context.fillText(
				line,
				x,
				y + (alignTop ? i : i + 1 - lines.length) * lineHeight,
			)
		})

	const isImageLoaded = (image) => image.complete && image.naturalHeight !== 0

	const render = ({
		title = '',
		meta1 = '',
		meta2 = '',
		meta3 = '',
		icon = '',
	}) => {
		parameters = {
			title,
			meta1,
			meta2,
			meta3,
			icon,
		}
		if (iconImage.src !== icon) {
			iconImage.addEventListener(
				'load',
				() => {
					render(parameters)
				},
				{ once: true },
			)
			iconImage.src = icon
		}

		context.fillStyle = '#c848ac'
		context.fillRect(0, 0, width, height)

		if (isImageLoaded(backgroundImage)) {
			context.drawImage(backgroundImage, 0, 0)
		}

		if (icon) {
			const frameWidth = 432
			const frameHeight = 432
			const top = 97
			const left = 1391

			if (isImageLoaded(iconImage)) {
				const scale = Math.min(
					frameWidth / iconImage.width,
					frameHeight / iconImage.height,
				)
				const imageWidth = scale * iconImage.width
				const imageHeight = scale * iconImage.height
				context.drawImage(
					iconImage,
					left + (frameWidth - imageWidth) / 2,
					top + (frameHeight - imageHeight) / 2,
					imageWidth,
					imageHeight,
				)
			} else {
				context.fillStyle = '#ff000044'
				context.fillRect(left, top, frameWidth, frameHeight)
			}
		}

		context.fillStyle = '#ffffff'

		setFont(94, true)
		renderMultiline(title.toLocaleUpperCase('cs'), 112, false, 96, 648)

		setFont(48, false)
		const meta = `${meta1}\n${meta2}\n${meta3}`
		renderMultiline(meta, 74, true, 103, 736)

		onUrlChange($canvas.toDataURL('image/jpeg'))
	}

	return {
		render,
	}
}
