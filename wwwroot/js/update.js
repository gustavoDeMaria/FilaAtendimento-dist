/**
 * FILA DE ATENDIMENTO
 * @author Gustavo Ferreira <gustavo@demaria.com.br>
 */

"use strict";
const painelId = document.getElementById("painel").dataset.painelId;

var connection = new signalR.HubConnectionBuilder()
    .withUrl("/ChamadaSenha" + (painelId && painelId > 0 ? "?painelId=" + painelId : ""))
    .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: function (retryContext) {
            // Lógica de retentativa exponencial (opcional)
            return Math.min(Math.pow(2, retryContext.previousRetryCount) * 1000, 30000); // Máximo de 30 segundos
        }
    })
    .build();

connection.onreconnected((connectionId) => {
    GetDataHora();
});

connection.start().then(function () {

    connection.on("ChamarSenha", function (objeto) {

        FILA.PainelWeb.Alert.play();

        FILA.PainelWeb.atruirSenhaPainelEHistorico(objeto);

        FILA.PainelWeb.ativarEfeitoVisual();

        FILA.PainelWeb.Speech.play(objeto, undefined);
    });

    connection.on("RechamarSenha", function (objeto) {

        FILA.PainelWeb.Alert.play();

        FILA.PainelWeb.atruirSenhaPainelEHistorico(objeto, false);

        FILA.PainelWeb.ativarEfeitoVisual();

        FILA.PainelWeb.Speech.play(objeto, undefined);
    });

    GetDataHora();

}).catch(function (err) {
    return console.error(err.toString());
});

function GetDataHora() {
    connection.stream("GetDataHora")
        .subscribe({
            next: (horaRecebida) => {
                document.getElementById("relogio").innerHTML = horaRecebida;
            },
            error: (error) => {
                console.error("Erro no stream:", error);
            },
            complete: () => {
                console.log("Stream finalizado.");
            }
        });
}
