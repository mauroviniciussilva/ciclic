<template>
  <div id="app">
    <main class="container">
      <div class="header text-center">
        <img src="/logo.png" alt="Logo Ciclic" class="logo" />
        <p class="margin-small-top text-primary">
          Simulador de investimento utilizando juro composto.
        </p>
      </div>
      <Calculadora />
    </main>
  </div>
</template>

<script>
import Calculadora from "./components/Calculadora.vue";

export default {
  name: "App",
  components: {
    Calculadora
  }
};
</script>
