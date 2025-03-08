// Добавляем обработчики событий для кнопок
document.getElementById("leftButton").addEventListener("touchstart", () => {
    velocityX = -4; // Движение влево
    doodler.img = doodlerLeftImg;
});

document.getElementById("rightButton").addEventListener("touchstart", () => {
    velocityX = 4; // Движение вправо
    doodler.img = doodlerRightImg;
});

document.getElementById("leftButton").addEventListener("touchend", () => {
    velocityX = 0; // Остановка
});

document.getElementById("rightButton").addEventListener("touchend", () => {
    velocityX = 0; // Остановка
});
