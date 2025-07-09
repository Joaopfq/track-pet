self.addEventListener("push", (e) => {
	const { title, body, icon } = JSON.parse(e.data.text());
	e.waitUntil(
		self.registration.showNotification(title || "Track Pet Notification", {
			body: body || "",
			icon: icon || "/icons/paw-192.png",
		})
	);
});

self.addEventListener("notificationclick", (event) => {
	event.notification.close();

	event.waitUntil(
		clients
			.matchAll({
				type: "window",
			})
			.then((clientList) => {
				for (const client of clientList) {
					if (client.url === "/" && "focus" in client)
						return client.focus();
				}
				if (clients.openWindow) return clients.openWindow("/");
			})
	);
});