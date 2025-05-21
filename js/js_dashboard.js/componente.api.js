document.addEventListener('DOMContentLoaded', function () {
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const cardsContainer = document.getElementById('cardsContainer');
    const graficoCanvas = document.getElementById('grafico');
    const form = document.getElementById('formFiltro');

    // Mapeia UF para código do município da capital (usado pela API)
    const ufToMunicipioId = {
        '12': '1200401', // Rio Branco
        '27': '2704302', // Maceió
        '13': '1302603', // Manaus
        '16': '1600303', // Macapá
        '29': '2927408', // Salvador
        '23': '2304400', // Fortaleza
        '53': '5300108', // Brasília
        '32': '3205309', // Vitória
        '52': '5208707', // Goiânia
        '21': '2111300', // São Luís
        '51': '5103403', // Cuiabá
        '50': '5002704', // Campo Grande
        '31': '3106200', // Belo Horizonte
        '15': '1501402', // Belém
        '25': '2507507', // João Pessoa
        '41': '4106902', // Curitiba
        '26': '2611606', // Recife
        '22': '2211001', // Teresina
        '33': '3304557', // Rio de Janeiro
        '24': '2408102', // Natal
        '43': '4314902', // Porto Alegre
        '11': '1100205', // Porto Velho
        '14': '1400100', // Boa Vista
        '42': '4205407', // Florianópolis
        '35': '3550308', // São Paulo
        '28': '2800308', // Aracaju
        '17': '1721000'  // Palmas
    };

    const token = 'CyL1S0m6RxqxWzQexEfRlUUCeSUnGuncD0f0ENEc';
    const baseURL = 'https://api.qedu.org.br/v1/ideb';

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Limpa gráfico anterior
        if (Chart.getChart(graficoCanvas)) {
            Chart.getChart(graficoCanvas).destroy();
        }
        cardsContainer.innerHTML = '';
        errorElement.style.display = 'none';
        loadingElement.style.display = 'block';

        const uf = document.getElementById('estado').value;
        const ciclo = document.getElementById('ciclo').value;
        const ano = parseInt(document.getElementById('ano').value);
        const municipioId = ufToMunicipioId[uf];

        if (!municipioId) {
            errorElement.textContent = 'Código do estado inválido.';
            errorElement.style.display = 'block';
            loadingElement.style.display = 'none';
            return;
        }

        const params = {
            id: municipioId,
            ano,
            dependencia_id: 2,
            ciclo_id: ciclo
        };

        const options = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            params
        };

        axios
            .get(baseURL, options)
            .then((response) => {
                if (!response.data || !response.data.data || !response.data.data.length) {
                    throw new Error('Nenhum dado encontrado na resposta da API');
                }

                loadingElement.style.display = 'none';
                cardsContainer.style.display = 'flex';

                const dataItem = response.data.data[0];

                renderGrafico(dataItem);
                createCards(dataItem);
            })
            .catch((error) => {
                console.error('Erro na requisição:', error);

                let errorMessage = 'Erro na requisição: ' + error.message;
                if (error.response) {
                    errorMessage += ` (Status: ${error.response.status})`;
                }

                errorElement.textContent = errorMessage;
                errorElement.style.display = 'block';
                loadingElement.style.display = 'none';
            });
    });

    function renderGrafico(data) {
        new Chart(graficoCanvas, {
            type: 'bar',
            data: {
                labels: ['IDEB', 'Aprendizado', 'Fluxo', 'Aprovação'],
                datasets: [{
                    label: 'Indicadores',
                    backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#FF5722'],
                    data: [data.ideb, data.aprendizado, data.fluxo, data.aprovacao]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    function createCards(dataItem) {
        const indicadores = [
            { title: 'IDEB', value: parseFloat(dataItem.ideb), description: 'Índice de Desenvolvimento da Educação Básica' },
            { title: 'Aprendizado', value: parseFloat(dataItem.aprendizado), description: 'Indicador de aprendizado' },
            { title: 'Fluxo', value: parseFloat(dataItem.fluxo), description: 'Indicador de fluxo escolar' },
            { title: 'Aprovação', value: parseFloat(dataItem.aprovacao), description: 'Taxa de aprovação (%)' }
        ];

        indicadores.forEach(indicator => {
            const card = document.createElement('div');
            card.className = 'card';

            const title = document.createElement('div');
            title.className = 'card-title';
            title.textContent = indicator.title;

            const value = document.createElement('div');
            value.className = 'card-value';
            value.textContent = indicator.value;

            const description = document.createElement('div');
            description.className = 'card-description';
            description.textContent = indicator.description;

            card.appendChild(title);
            card.appendChild(value);
            card.appendChild(description);

            cardsContainer.appendChild(card);
        });
    }
});
