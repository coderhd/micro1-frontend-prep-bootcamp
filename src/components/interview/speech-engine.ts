// Web Speech API Voice Engine for "Zara" AI Recruiter

export function isSpeechSupported (): boolean {
	return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function stopZaraVoice (): void {
	if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
		window.speechSynthesis.cancel()
	}
}

export function speakZaraVoice (
	text: string,
	onStart?: () => void,
	onEnd?: () => void,
	isMuted: boolean = false,
): void {
	if (isMuted || !isSpeechSupported()) {
		if (onStart) onStart()
		if (onEnd) onEnd()
		return
	}

	stopZaraVoice()

	const cleanText = text.replace(/<[^>]*>?/gm, '').replace(/[`*#]/g, '')
	const utterance = new SpeechSynthesisUtterance(cleanText)

	// Configure natural female recruiter voice if available
	const voices = window.speechSynthesis.getVoices()
	const femaleVoice = voices.find(
		(v) =>
			(v.name.includes('Samantha') ||
				v.name.includes('Google UK English Female') ||
				v.name.includes('Microsoft Zira') ||
				v.name.includes('Female') ||
				v.name.includes('Victoria') ||
				v.lang.startsWith('en')) &&
			!v.name.includes('Male'),
	)

	if (femaleVoice) {
		utterance.voice = femaleVoice
	}

	utterance.rate = 1.05
	utterance.pitch = 1.05

	utterance.onstart = () => {
		if (onStart) onStart()
	}

	utterance.onend = () => {
		if (onEnd) onEnd()
	}

	utterance.onerror = () => {
		if (onEnd) onEnd()
	}

	window.speechSynthesis.speak(utterance)
}

// Browser Speech Recognition (Speech-to-Text)
export function createSpeechRecognizer (
	onResult: (text: string) => void,
	onEnd?: () => void,
): any {
	const SpeechRecognition =
		(window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

	if (!SpeechRecognition) {
		return null
	}

	try {
		const recognition = new SpeechRecognition()
		recognition.continuous = true
		recognition.interimResults = true
		recognition.lang = 'en-US'

		recognition.onresult = (event: any) => {
			let fullTranscript = ''
			for (let i = event.resultIndex; i < event.results.length; ++i) {
				fullTranscript += event.results[i][0].transcript
			}
			onResult(fullTranscript)
		}

		recognition.onend = () => {
			if (onEnd) onEnd()
		}

		recognition.onerror = () => {
			if (onEnd) onEnd()
		}

		return recognition
	} catch (e) {
		console.warn('Speech recognition not available', e)
		return null
	}
}
