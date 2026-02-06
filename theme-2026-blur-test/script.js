/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *
 *  2026 Theme Blur Effects Test App - Script
 *--------------------------------------------------------------------------------------------*/

document.addEventListener('DOMContentLoaded', () => {
	// Theme switcher
	const themeButtons = document.querySelectorAll('.theme-btn');
	const body = document.body;

	themeButtons.forEach(btn => {
		btn.addEventListener('click', () => {
			const theme = btn.dataset.theme;

			// Update active button
			themeButtons.forEach(b => b.classList.remove('active'));
			btn.classList.add('active');

			// Update body class
			body.classList.remove('theme-dark', 'theme-light');
			body.classList.add(`theme-${theme}`);

			// Store preference
			localStorage.setItem('2026-theme', theme);
		});
	});

	// Restore saved theme
	const savedTheme = localStorage.getItem('2026-theme');
	if (savedTheme) {
		body.classList.remove('theme-dark', 'theme-light');
		body.classList.add(`theme-${savedTheme}`);
		themeButtons.forEach(btn => {
			btn.classList.toggle('active', btn.dataset.theme === savedTheme);
		});
	}

	// Default positions for overlays
	const defaultPositions = {
		'quick-input': { top: 80, left: 'calc(50% - 200px)' },
		'context-menu': { top: 200, left: 320 },
		'suggest-widget': { top: 280, left: 450 },
		'hover-widget': { top: 350, left: 600 },
		'notification': { top: 400, left: 900 },
		'dialog': { top: 250, left: 'calc(50% - 150px)' },
		'debug-toolbar': { top: 50, left: 'calc(50% - 150px)' },
		'find-widget': { top: 80, left: 700 },
		'parameter-hints': { top: 380, left: 380 },
		'inline-chat': { top: 300, left: 350 },
		'breadcrumb-picker': { top: 120, left: 400 },
	};

	// Apply default positions
	function applyDefaultPositions() {
		Object.entries(defaultPositions).forEach(([id, pos]) => {
			const element = document.getElementById(id);
			if (element) {
				element.style.position = 'fixed';
				element.style.top = typeof pos.top === 'number' ? `${pos.top}px` : pos.top;
				element.style.left = typeof pos.left === 'number' ? `${pos.left}px` : pos.left;
				element.style.right = 'auto';
				element.style.bottom = 'auto';
				element.style.transform = 'none';
			}
		});
	}

	// Restore saved positions or apply defaults
	function restorePositions() {
		const savedPositions = localStorage.getItem('2026-overlay-positions');
		if (savedPositions) {
			try {
				const positions = JSON.parse(savedPositions);
				Object.entries(positions).forEach(([id, pos]) => {
					const element = document.getElementById(id);
					if (element) {
						element.style.position = 'fixed';
						element.style.top = pos.top;
						element.style.left = pos.left;
						element.style.right = 'auto';
						element.style.bottom = 'auto';
						element.style.transform = 'none';
					}
				});
			} catch {
				applyDefaultPositions();
			}
		} else {
			applyDefaultPositions();
		}
	}

	restorePositions();

	// Save positions
	function savePositions() {
		const positions = {};
		document.querySelectorAll('.overlay-widget.draggable').forEach(el => {
			const rect = el.getBoundingClientRect();
			positions[el.id] = {
				top: `${rect.top}px`,
				left: `${rect.left}px`,
			};
		});
		localStorage.setItem('2026-overlay-positions', JSON.stringify(positions));
	}

	// Make overlays draggable via their drag handle
	const draggables = document.querySelectorAll('.overlay-widget.draggable');
	draggables.forEach(widget => {
		makeDraggable(widget);
	});

	function makeDraggable(element) {
		let isDragging = false;
		let startX, startY;
		let initialX, initialY;

		const handle = element.querySelector('.drag-handle');
		if (!handle) return;

		handle.addEventListener('mousedown', (e) => {
			isDragging = true;
			startX = e.clientX;
			startY = e.clientY;

			const rect = element.getBoundingClientRect();
			initialX = rect.left;
			initialY = rect.top;

			element.classList.add('dragging');
			e.preventDefault();
		});

		document.addEventListener('mousemove', (e) => {
			if (!isDragging) return;

			const deltaX = e.clientX - startX;
			const deltaY = e.clientY - startY;

			element.style.position = 'fixed';
			element.style.left = `${initialX + deltaX}px`;
			element.style.top = `${initialY + deltaY}px`;
			element.style.right = 'auto';
			element.style.bottom = 'auto';
			element.style.transform = 'none';
		});

		document.addEventListener('mouseup', () => {
			if (isDragging) {
				isDragging = false;
				element.classList.remove('dragging');
				savePositions();
			}
		});
	}

	// Reset positions
	const resetBtn = document.getElementById('reset-position');
	resetBtn.addEventListener('click', () => {
		localStorage.removeItem('2026-overlay-positions');
		applyDefaultPositions();
	});

	// Blur toggle
	const blurToggle = document.getElementById('disable-blur');
	blurToggle.addEventListener('change', () => {
		body.classList.toggle('blur-disabled', blurToggle.checked);
		localStorage.setItem('2026-blur-disabled', blurToggle.checked);
	});

	// Restore blur setting
	const savedBlurDisabled = localStorage.getItem('2026-blur-disabled') === 'true';
	if (savedBlurDisabled) {
		blurToggle.checked = true;
		body.classList.add('blur-disabled');
	}

	// Add keyboard shortcuts
	document.addEventListener('keydown', (e) => {
		// Don't trigger shortcuts when typing in inputs
		if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
			return;
		}

		// Toggle theme with T
		if (e.key === 't' && !e.ctrlKey && !e.metaKey && !e.altKey) {
			const currentTheme = body.classList.contains('theme-dark') ? 'dark' : 'light';
			const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

			body.classList.remove('theme-dark', 'theme-light');
			body.classList.add(`theme-${newTheme}`);

			themeButtons.forEach(btn => {
				btn.classList.toggle('active', btn.dataset.theme === newTheme);
			});

			localStorage.setItem('2026-theme', newTheme);
		}

		// Toggle blur with B
		if (e.key === 'b' && !e.ctrlKey && !e.metaKey && !e.altKey) {
			blurToggle.checked = !blurToggle.checked;
			body.classList.toggle('blur-disabled', blurToggle.checked);
			localStorage.setItem('2026-blur-disabled', blurToggle.checked);
		}

		// Reset positions with R
		if (e.key === 'r' && !e.ctrlKey && !e.metaKey && !e.altKey) {
			localStorage.removeItem('2026-overlay-positions');
			applyDefaultPositions();
		}
	});

	// Log keyboard shortcuts info
	console.log('🎨 2026 Theme Blur Effects Test');
	console.log('Keyboard shortcuts:');
	console.log('  T - Toggle theme (dark/light)');
	console.log('  B - Toggle blur effects');
	console.log('  R - Reset overlay positions');
	console.log('');
	console.log('Drag overlays by their gripper handle to test blur over different colors');
});
