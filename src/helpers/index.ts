


const animate = (ctx: CanvasRenderingContext2D, img: ImageBitmap) => {
    let width = window.innerWidth;
    let height = window.innerHeight - 105.5;

    let x = width / 2;
    let y = height / 2;

    let m = 20;
    let dir = 'minus';
    let canvas2: HTMLCanvasElement = document.querySelector('#bg')!;
    if (!canvas2) {
        canvas2 = document.createElement('canvas');
        canvas2.setAttribute('id', 'bg');

        document.getElementById('app')!.append(canvas2);
    }
    let ctx2 = canvas2.getContext('2d')!;

    canvas2.width = width;
    canvas2.height = height;
    const draw = () => {
        setInterval(() => {
            ctx2.clearRect(0, 0, width, height);
            ctx2.fillStyle = 'rgba(233, 30, 99 , 0.4)';
            ctx2.beginPath();
            ctx2.arc(x, y + m, 150 , 0, 2 * Math.PI, false);
            ctx2.fill();
            ctx2.fillStyle = 'rgba(23, 30, 99 , 0.4)';
            ctx2.beginPath();
            ctx2.arc(x + m, y,150 , 0, 2 * Math.PI, false);
            ctx2.fill();
            ctx2.fillStyle = 'rgba(150, 470, 20 , 0.4)';
            ctx2.beginPath();
            ctx2.arc(x - m, y - m,150 , 0, 2 * Math.PI, false);
            ctx2.fill();
            if (m > 0 && dir === 'minus') {
                m -= 5;
                if (m === 0) {
                    dir = 'plus';
                }
            } else if (dir === 'plus') {
                m += 5;
                if (m === 20) {
                    dir = 'minus';
                }
            }
        }, 100);
    }
    ctx.beginPath();
    ctx.arc(x, y, 130, 0, Math.PI * 2, false);
    ctx.clip()
    ctx.drawImage(img, x -300, y -150, img.width * 0.45, img.height * 0.45);
    ctx.save();
    draw();

}
/**
 * draw photo image that was taken by camera
 * @param canvas - HTMLCanvasElement
 * @param img - ImageBitmap
 */
export const drawCanvas = (canvas: HTMLCanvasElement, img: ImageBitmap): void => {
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 105.5;
    clearCanvas(canvas);
    animate(ctx, img);
}

export const clearCanvas = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
}
/**
 * Fetch image data from the server
 */
export const getImage = async (): Promise<Blob> => {
    const { image } = await fetch('/image').then((resp) =>
        resp.json()
    );
    const base64Response = await fetch(image);
    const blob = await base64Response.blob();

    return blob;
}

/**
 * Post image to the server
 * @param image
 */
export const postImage = async (image: string | ArrayBuffer | null ): Promise<{}> => {
    return await fetch('/image', {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: image
    })
};

/**
 * Remove image from the server
 */
export const deleteImage = async (): Promise<{}> => {
    return await fetch('/image', {
        method: 'DELETE',
    })
};
