/**
 * Remove no-js class, add js class
 */

export const jsReady = () => {
    const el = document.querySelector('html');
    el.classList.remove('no-js');
    el.classList.add('js');
};
