<template>
  <div>
    <!-- This component doesn't need visible elements; it only triggers toasts -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      defaultConfig: {
        toaster: "b-toaster-bottom-right",
        solid: true,
        autoHideDelay: 3000,
        appendToast: true
      }

    }
  },
  methods: {
    showNotification(message, params = { title: "Notification", variant: "info" }) {
      this.$bvToast.toast(message, {
        ...this.defaultConfig,
        ...params,
      });
    },

    showSuccess(message, params = {}) {
      this.showNotification(message, { title: "Success", variant: "success", ...params });
    },

    showError(message, params = {}) {
      this.showNotification(message, { title: "Error", variant: "danger", ...params });
    },

    showInfo(message, params = {}) {
      this.showNotification(message, { title: "Info", variant: "info", ...params });
    }
  },
};
</script>
