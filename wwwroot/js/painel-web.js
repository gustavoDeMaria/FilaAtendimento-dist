/**
 * FILA DE ATENDIMENTO
 * @author Gustavo Ferreira <gustavo@demaria.com.br>
 */

var FILA = FILA || {};

FILA.PainelWeb = {

    historico: function (numeroSenha, guiche, horaChamada) {

        //copia o primeiro elemento para manter o comportamento do Razor
        const primeiroElemento = document.querySelector(".historico-senha");
        // 1. Clona o primeiro elemento
        const novoElemento = primeiroElemento.cloneNode(true);

        // 2. Encontra os spans dentro do elemento clonado
        const numeroSenhaSpan = novoElemento.querySelector(".historico-numero-senha");
        const guicheSpan = novoElemento.querySelector(".historico-guiche");
        const horaSpan = novoElemento.querySelector(".historico-hora");

        var hasText = numeroSenha && numeroSenha.length > 0;

        // 3. Atualiza o conteúdo dos spans com os dados da nova senha
        numeroSenhaSpan.textContent = numeroSenha;
        guicheSpan.textContent = guiche;
        horaSpan.textContent = horaChamada;

        // 4. Insere o novo elemento no topo do histórico

        if (hasText) {
            const historicoDiv = document.getElementById("historico");
            historicoDiv.insertBefore(novoElemento, historicoDiv.firstChild);

            //exibir novo elemento
            novoElemento.classList.remove('hide');

            // Remove elementos antigos se o histórico ultrapassar 10 itens
            const historicoSenhas = historicoDiv.querySelectorAll(".historico-senha");
            if (historicoSenhas.length > 10) {
                for (let i = 10; i < historicoSenhas.length; i++) {
                    historicoDiv.removeChild(historicoSenhas[i]);
                }
            }
        }
    },

    ativarEfeitoVisual: function () {
        const elementoTexto = document.getElementById('senha-numero-senha');

        elementoTexto.classList.add('texto-alterado');

        // Remova a classe após um curto período para permitir que a animação seja executada novamente
        setTimeout(() => {
            elementoTexto.classList.remove('texto-alterado');
        }, 6000);
    },

    formatar: function (senha) {
        var numero = senha.numero + "";
        var length = parseInt(senha.length || 3);
        while (numero.length < length) {
            numero = "0" + numero;
        }
        return numero;
    },

    atruirSenhaPainelEHistorico: function (senha, atribuiHistorico = true) {
        //alimentando histórico
        if (atribuiHistorico) {
            this.historico(document.getElementById("senha-numero-senha").innerHTML,
                document.getElementById("senha-guiche").innerHTML,
                document.getElementById("senha-hora-chamada").innerHTML);
        }

        // atribuindo senha atual
        document.getElementById("senha-numero-senha").innerHTML = senha.sigla + "-" + this.formatar(senha);
        document.getElementById("senha-guiche").innerHTML = senha.local;
        document.getElementById("senha-hora-chamada").innerHTML = senha.horaChamada;
    },



    Alert: {

        test: function () {
            this.play($('#alert-file').val());
        },

        play: function () {
            document.getElementById('alert').src = '/simple-notification-152054.mp3';
            document.getElementById('alert').play();
        }
    },

    Speech: {
        queue: [],

        format: function (senha) {
            var numero = senha.numero + "";
            var length = parseInt(senha.length || 3);
            while (numero.length < length) {
                numero = "0" + numero;
            }
            return senha.sigla + numero;
        },


        test: function () {
            this.play(
                {
                    mensagem: 'Convencional',
                    sigla: 'A',
                    numero: 1,
                    length: 3,
                    local: 'Guichê 1',
                    instrucao_local: ['guiche', '1'],
                },
                {
                    vocalizar: true,
                    zeros: 3,
                    local: "Guichê",
                    lang: "pt-BR"
                }
            );
        },

        play: function (senha, params) {
            var vocalizar, zeros, local, lang;
            if (params) {

                vocalizar = params.vocalizar;
                zeros = params.zeros;
                local = params.local;
                lang = params.lang;
            }
            else {
                vocalizar = true;
                zeros = 3;
                local = "Guichê";
                lang = "pt-BR";
            }
            if (vocalizar) {
                // "senha"
                this.queue.push({ name: "senha", lang: lang });

                // sigla + numero
                var text = (zeros) ? this.format(senha) : senha.sigla + senha.numero;
                for (var i = 0; i <= text.length - 1; i++) {
                    this.queue.push({ name: text.charAt(i).toLowerCase(), lang: lang });
                }

                if (local && senha.instrucao_local) {
                    for (var i = 0; i <= senha.instrucao_local.length - 1; i++) {
                        this.queue.push({ name: senha.instrucao_local[i], lang: lang });
                    }
                }
            }
            this.processQueue();
        },

        playFile: function (filename) {
            var self = this;
            var bz = new buzz.sound(filename, {
                formats: ["mp3"],
                autoplay: true
            });

            //bz.bind("loadeddata", function () {
            //    buzz.sounds = [];
            //});

            bz.setVolume(100);

            bz.bind("ended", function () {
               // buzz.sounds = [];
                self.processQueue();
            });

            bz.bind("error", function () {
                buzz.sounds = [];
                self.processQueue();
            });
        },

        processQueue: function () {
            if (this.queue.length === 0) {
                return;
            }

            if (buzz.sounds.length > 0) {
                buzz.sounds = [];
            }

            var current = this.queue.shift();
            var filename = "/media/" + current.name;
                      
            this.playFile(filename);
        }
    },

    Storage: {

        set: function (name, value) {
            if (localStorage) {
                localStorage.setItem(name, value);
            } else {
                // cookie
                var expires = "";
                document.cookie = name + "=" + value + expires + "; path=/";
            }
        },

        get: function (name) {
            if (localStorage) {
                return localStorage.getItem(name);
            } else {
                // cookie
                var nameEQ = name + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) === ' ') {
                        c = c.substring(1, c.length);
                    }
                    if (c.indexOf(nameEQ) === 0) {
                        return c.substring(nameEQ.length, c.length);
                    }
                }
            }
            return null;
        }

    },

    Config: {

        load: function ($scope) {
            $scope.url = FILA.PainelWeb.Storage.get('url');
            $scope.unidade = JSON.parse(FILA.PainelWeb.Storage.get('unidade')) || {};
            $scope.servicos = JSON.parse(FILA.PainelWeb.Storage.get('servicos')) || [];
            FILA.PainelWeb.alert = FILA.PainelWeb.Storage.get('alert') || 'ekiga-vm.wav';
            FILA.PainelWeb.vocalizar = FILA.PainelWeb.Storage.get('vocalizar') === '1';
            FILA.PainelWeb.vocalizarZero = FILA.PainelWeb.Storage.get('vocalizarZero') === '1';
            FILA.PainelWeb.vocalizarLocal = FILA.PainelWeb.Storage.get('vocalizarLocal') === '1';
            FILA.PainelWeb.lang = FILA.PainelWeb.Storage.get('lang') || 'pt';

            // atualizando interface
            $('#alert-file').val(FILA.PainelWeb.alert);
            $('.vocalizar').prop('disabled', !FILA.PainelWeb.vocalizar);
            $('#vocalizar-status').prop('checked', FILA.PainelWeb.vocalizar);
            $('#vocalizar-zero').prop('checked', FILA.PainelWeb.vocalizarZero);
            $('#vocalizar-local').prop('checked', FILA.PainelWeb.vocalizarLocal);
            $('#idioma').val(FILA.PainelWeb.lang);
        },

        save: function ($scope) {
            // pegando da interface
            FILA.PainelWeb.alert = $('#alert-file').val();
            FILA.PainelWeb.vocalizar = $('#vocalizar-status').prop('checked');
            FILA.PainelWeb.vocalizarZero = $('#vocalizar-zero').prop('checked');
            FILA.PainelWeb.vocalizarLocal = $('#vocalizar-local').prop('checked');
            FILA.PainelWeb.lang = $('#idioma').val();
            // salvando valores
            FILA.PainelWeb.Storage.set('url', $scope.url);
            FILA.PainelWeb.Storage.set('unidade', JSON.stringify($scope.unidade));
            FILA.PainelWeb.Storage.set('servicos', JSON.stringify($scope.servicos));
            FILA.PainelWeb.Storage.set('alert', FILA.PainelWeb.alert);
            FILA.PainelWeb.Storage.set('vocalizar', FILA.PainelWeb.vocalizar ? '1' : '0');
            FILA.PainelWeb.Storage.set('vocalizarZero', FILA.PainelWeb.vocalizarZero ? '1' : '0');
            FILA.PainelWeb.Storage.set('vocalizarLocal', FILA.PainelWeb.vocalizarLocal ? '1' : '0');
            FILA.PainelWeb.Storage.set('lang', FILA.PainelWeb.lang);
        }
    },

    fullscreen: function () {
        var elem = document.body;
        if (elem.requestFullScreen) {
            elem.requestFullScreen();
        }
        if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen();
        }
        if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        }
        if (elem.msRequestFullScreen) {
            elem.msRequestFullScreen();
        }
    },

};

Array.prototype.contains = function (elem) {
    for (var i = 0; i < this.length; i++) {
        if (
            // se for senha
            (elem.sigla && this[i].sigla === elem.sigla && this[i].numero === elem.numero)
            ||
            // qualquer outro objeto
            (this[i] == elem)
        ) {
            return true;
        }
    }
    return false;
};

Array.prototype.remove = function (elem) {
    for (var i = 0; i < this.length; i++) {
        if (
            // se for senha
            (elem.sigla && this[i].sigla === elem.sigla && this[i].numero === elem.numero)
            ||
            // qualquer outro objeto
            (this[i] == elem)
        ) {
            this.splice(i, 1);
        }
    }
};