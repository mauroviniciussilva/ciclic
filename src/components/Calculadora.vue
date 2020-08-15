<template>
  <div>
    <div id="form-calculadora" v-if="result === 0">
      <div class="form-group">
        <label>
          Nome
          <sup class="text-secondary">*</sup>
        </label>
        <input
          type="text"
          name="nome"
          v-model="form.nome"
          placeholder="Ex: João"
        />
        <small>Seu nome</small>
      </div>
      <div class="align-space-between">
        <div class="form-group column-3 margin-medium-top">
          <label>
            Mensalidade
            <sup class="text-secondary">*</sup>
          </label>
          <input
            type="number"
            name="mensalidade"
            v-model="form.mensalidade"
            placeholder="Ex: 100"
          />
          <small>Quanto você vai investir por mês</small>
        </div>
        <div class="form-group column-3 margin-medium-top">
          <label>
            Tempo de Contribuição
            <sup class="text-secondary">*</sup>
          </label>
          <input
            type="number"
            name="tempo_contribuicao"
            v-model="form.tempo_contribuicao"
            placeholder="Ex: 24"
          />
          <small>Tempo do investimento em meses</small>
        </div>
        <div class="form-group column-3 margin-medium-top">
          <label>
            Rendimento
            <sup class="text-secondary">*</sup>
          </label>
          <input
            type="number"
            name="rendimento_anual"
            v-model="form.rendimento_anual"
            placeholder="Ex: 7"
          />
          <small>Rendimento anual (%)</small>
        </div>
      </div>
      <div class="form-group text-center margin-large-top">
        <button class="button-primary" @click="submit()" :disabled="loading">
          {{ loading ? "Simulando..." : "Simular" }}
        </button>
      </div>
    </div>
    <div id="show-result" class="text-center" v-else>
      <h1>
        Fala <b>{{ form.nome }}</b> !
      </h1>

      <p class="margin-medium-top">
        Se você juntar {{ maskCurrency(form.mensalidade) }} todo mês, você terá
        {{ maskCurrency(result) }} em {{ form.tempo_contribuicao }} meses.
      </p>

      <p>
        <small>
          Lembre-se: isso é apenas uma estimativa, que não leva em conta fatores
          como a variação do rendimento, taxa básica de juros ou imposto de
          renda
        </small>
      </p>

      <div class="form-group text-center margin-large-top">
        <button class="button-primary" @click="simularNovamente()">
          Simular Novamente
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import mathService from "@/services/mathService";

export default {
  name: "Calculadora",
  data() {
    return {
      form: {},
      loading: false,
      result: 0
    };
  },
  methods: {
    submit() {
      let invalid = false;
      if (!this.form.nome) invalid = true;
      if (!this.form.mensalidade) invalid = true;
      if (!this.form.tempo_contribuicao) invalid = true;
      if (!this.form.rendimento_anual) invalid = true;
      if (invalid) {
        return this.alert(
          "Ooops... Você precisa preencher todos os campos para poder fazer a simulação"
        );
      }

      this.loading = true;
      const expression = this.generateExpression();
      mathService
        .calcExpression(expression)
        .then(response => {
          this.result = parseFloat(response.data.result).toFixed(2);
        })
        .catch(() => {
          this.alert("Erro ao realizar simulação. Tente novamente.");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    generateExpression() {
      const { mensalidade, tempo_contribuicao, rendimento_anual } = this.form;
      const rendimento_mensal = parseFloat(rendimento_anual) / 12;
      const taxa_de_juros = (rendimento_mensal / 100).toFixed(3);
      return `${mensalidade} * (((1 + ${taxa_de_juros}) ^ ${tempo_contribuicao} - 1) / ${taxa_de_juros})`;
    },
    simularNovamente() {
      this.form = {};
      this.result = 0;
    },
    maskCurrency(value) {
      if (value === null) value = 0;
      return parseFloat(value).toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
      });
    },
    alert(message) {
      window.alert(message);
    }
  }
};
</script>
