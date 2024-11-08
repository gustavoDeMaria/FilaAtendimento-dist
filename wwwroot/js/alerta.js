/**
 * FILA DE ATENDIMENTO
 * @author Gustavo Ferreira <gustavo@demaria.com.br>
 */

"use strict";
var connection = new signalR.HubConnectionBuilder()
    .withUrl("/ChamadaSenha")
    .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: function (retryContext) {
            // Lógica de retentativa exponencial (opcional)
            return Math.min(Math.pow(2, retryContext.previousRetryCount) * 1000, 30000); // Máximo de 30 segundos
        }
    })
    .build();

connection.start().then(function () {

    connection.on("ServicoAlerta", function (objeto) {

        window.chrome.webview.postMessage({ type: "ServicoAlerta", data: objeto });

    }); 

}).catch(function (err) {
    return console.error(err.toString());
});
