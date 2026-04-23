import PhotoSwipeLightbox from './photoswipe-lightbox.esm.min.js';

export function galleryInit() {
    const gallery = document.getElementById("galleryContainer");
    if (!gallery) return
    const links = gallery.querySelectorAll("a");
    links.forEach(link => {
        const img = link.querySelector("img");
        if (!img) return;

        const newImg = new Image();
        newImg.src = img.src;

        newImg.onload = () => {
            link.dataset.pswpWidth = newImg.naturalWidth;
            link.dataset.pswpHeight = newImg.naturalHeight;
        };
    })

    const lightbox = new PhotoSwipeLightbox({
        gallery: '#galleryContainer',
        children: 'a',
        pswpModule: () => import('./photoswipe.esm.min.js')
    });
    lightbox.init();


}