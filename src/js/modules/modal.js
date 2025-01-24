export default class Modal {
	constructor(overlayId, modalId, openBtnId, closeBtnId) {
		this.overlay = document.getElementById(overlayId);
		this.modal = document.getElementById(modalId);
		this.openBtn = document.getElementById(openBtnId);
		this.closeBtn = document.getElementById(closeBtnId);
		this.init();
	}

	init = () => {
		this.openBtn.addEventListener("click", this.open);
		this.closeBtn.addEventListener("click", this.close);
		this.overlay.addEventListener("click", this.overlayClose);
	};

	overlayClose = (e) => {
		if (e.target === e.currentTarget) {
			this.close();
		}
	};

	open = () => {
		document.body.classList.add("no-scroll");
		this.overlay.classList.add("overlay--active");
		requestAnimationFrame(() => {
			this.modal.classList.add("modal--active");
			requestAnimationFrame(() => {
				this.overlay.classList.add("overlay--opacity");
			});
		});
	};

	close = () => {
		this.overlay.classList.remove("overlay--opacity");
		requestAnimationFrame(() => {
			this.modal.classList.remove("modal--active");
			this.modal.addEventListener(
				"transitionend",
				() => {
					this.overlay.classList.remove("overlay--active");
					document.body.classList.remove("no-scroll");
				},
				{ once: true }
			);
		});
	};
}
