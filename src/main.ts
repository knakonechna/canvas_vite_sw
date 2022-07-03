import './style.css'
import App from "./App";

if (process.env.NODE_ENV === 'development') {
    // @ts-ignore
    const { worker } = await import('./mocks/browser');
    worker.start()
}

App();

