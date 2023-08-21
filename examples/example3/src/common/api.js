import appRoutes from "./routes";

export const saveGameScore = (score) => {
    try {
        if(window?.TelegramGameProxy){
            window.fetch(appRoutes.score, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    game: true,
                    score: score,
                    userData: window?.TelegramGameProxy.initData,
                    url: window.location.href,
                    TelegramGameProxy: window?.TelegramGameProxy,
                })
            })
        }
    }catch(e){

    }
}