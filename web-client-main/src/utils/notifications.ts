const NOTIFICATION_AREA_ID = 'notifications_area';
const ANIMATION_DURATION = 1000;

export function createNotification(message: string, duration = 5000) {
    let bottom = 30;
    const gutter = 10;
    const timestamp = new Date().getTime();
    let notificationClass = 'we-ride';

    if (window.location.href.includes('we-hiit')) {
        notificationClass = 'we-hiit';
    }

    const notification = `<div class='notification__container ${notificationClass} visible' data-timestamp='${timestamp}'>
    <p class='notification__message'>${message}</p>
  </div>`;
    document.getElementById(NOTIFICATION_AREA_ID)!.innerHTML += notification;

    setTimeout(() => {
        hideSnackBar(timestamp);
    }, duration);

    setSnacksPositions();

    function hideSnackBar(timestamp: number) {
        const snacks = document.getElementsByClassName('notification__container');
        Array.prototype.forEach.call(snacks, function (snackBar: any, index: number) {
            if (Number(snackBar.dataset.timestamp) === timestamp) {
                snackBar.className = 'notification__container gone';
                setTimeout(() => {
                    snackBar.remove();
                    updateSnacksPosition();
                }, ANIMATION_DURATION);
            }
        });

    }

    function setSnacksPositions() {
        const snacks = document.getElementsByClassName('notification__container');
        Array.prototype.forEach.call(snacks, function (snackBar: any, index: number) {
            snackBar.style.transform = `translateY(-${bottom}px)`;
            bottom += gutter + snackBar.clientHeight;
        });
    }

    function updateSnacksPosition() {
        const snacks = document.getElementsByClassName('notification__container');
        Array.prototype.forEach.call(snacks, function (snackBar: any, index: number) {
            bottom -= gutter + snackBar.clientHeight;
            snackBar.style.transform = `translateY(-${bottom}px)`;
        });
    }
}