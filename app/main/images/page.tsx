"use client";

import { ImageGallery } from './image-gallery';

export default function Images() {

    const galleryImages = [
        '/images/sample1.jpg',
        '/images/sample2.jpg',
    ];

    return (
        <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="grid auto-rows-min gap-4 grid-cols-2">
                <ImageGallery images={galleryImages} />
            </div>
            <div className="grid auto-rows-min gap-4 grid-cols-2">

            </div>
        </div>
    );
}