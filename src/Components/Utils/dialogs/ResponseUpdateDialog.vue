<template>
  <v-dialog
    :value="value"
    max-width="500px"
    @input="$emit('input', $event)"
  >
    <v-card>
      <v-card-title
        class="headline grey lighten-2"
        primary-title
      >
        {{ $t('refreshResponse') }}
      </v-card-title>
      <v-card-text>
        {{ $t('doYouWant') }}
        {{ user }}
        {{ $t('dataOnDevice') }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          text
          @click="$emit('onReuploadResponse')"
        >
          {{ $t('yes') }}
        </v-btn>
        <v-btn
          color="primary"
          text
          @click="$emit('onDeclineReuploading')"
        >
          {{ $t('no') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ResponseUpdateDialog',
  props: {
    userData: {
      type: Object,
      required: true,
    },
    value: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      user: !this.userData.MRN ? this.userData.email : this.userData.MRN
    }
  }
};
</script>
