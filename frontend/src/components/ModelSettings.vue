<template>
    <div class="settings-panel">
      <div class="setting">
        <label for="model" 
          @mouseover="handleMouseOver($event,'The model which will generate the completion. Some models are suitable for natural language tasks, others specialize in code.')"
          @mouseleave="handleMouseLeave">
        Model
        </label>
        <select v-model="settings.model" id="model">
          <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
          <option value="gpt-4-turbo-preview">gpt-4-turbo-preview</option>
        </select>
      </div>
      <div class="setting" v-for="setting in settingsList" :key="setting.name">
        <div class="input-group">
          <label :for="setting.name" 
               @mouseover="handleMouseOver($event, setting.description)"
               @mouseleave="handleMouseLeave">
          {{ setting.label  }} 
          </label>
          <input :type="setting.type" v-model.number="settings[setting.name]" :id="setting.name" :min="setting.min" :max="setting.max" :step="setting.step">
        </div>
        <input type="range" v-model="settings[setting.name]" :min="setting.min" :max="setting.max" :step="setting.step" :title="setting.description">
      </div>
      <div class="setting">
        <div class="setting-content">
          <label for="chatEnabled"
            @mouseover="handleMouseOver($event,'Activates real-time chat functionality: Turning this on enables users to engage in interactive conversations with the AI model, providing a dynamic and responsive user experience.')"
            @mouseleave="handleMouseLeave">
            Enable Chat
          </label>
          <input type="checkbox" id="chatEnabled" v-model="settings.chatEnabled" class="toggle-switch">
        </div>
      </div>
      <div class="setting">
        <div class="setting-content">
          <label for="embeddingsEnabled"
            @mouseover="handleMouseOver($event,'Enables embedding generation: When activated, this feature processes textual content to create dense vector representations, enhancing content relevance and retrieval in AI-driven tasks.')"
            @mouseleave="handleMouseLeave">
            Enable Embeddings
        </label>
          <input type="checkbox" id="embeddingsEnabled" v-model="settings.embeddingsEnabled" class="toggle-switch">
        </div>
      </div>

      <Tooltip :visible="isTooltipVisible" :position="tooltipPosition">
        {{ tooltipContent }}
      </Tooltip>
    </div>
  </template>
  
<script>
  import Tooltip from './TooltipAria.vue'

  export default {
    components: {
      Tooltip,
    },
    data() {
      return {
        settings: {
          model: 'gpt-3.5-turbo',
          temperature: 1,
          maxTokens: 4096,
          topP: 1,
          frequencyPenalty: 0,
          presencePenalty: 0,
          chatEnabled: false,
          embeddingsEnabled: true,
        },
        settingsList: [
            { name: 'temperature', label: 'Temperature', type: 'number', min: 0, max: 2, step: 0.01, description: 'Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive.'},
            { name: 'maxTokens', label: 'Max tokens', type: 'number', min: 1, max: 4096, step: 1, description: 'The maximum number of tokens to generate shared between the prompt and completion. The exact limit varies by model. (One token is roughly 4 characters for standard English text.)' },
            { name: 'topP', label: 'Top P', type: 'number', min: 0, max: 1, step: 0.01, description: 'Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered.' },
            { name: 'frequencyPenalty', label: 'Frequency penalty', type: 'number', min: 0, max: 2, step: 0.01, description: "How much to penalize new tokens based on their existing frequency in the text so far. Decreases the model's likelihood to repeat the same line verbatim."},
            { name: 'presencePenalty', label: 'Presence penalty', type: 'number', min: 0, max: 2, step: 0.01, description: "How much to penalize new tokens based on whether they appear in the text so far. Increases the model's likelihood to talk about new topics."},
        ],
        isTooltipVisible: false,
        tooltipPosition: { left: 0, top: 0},
        tooltipContent: '',
      };
    },
    watch: {
      settings: {
        deep: true,
        handler(newSettings) {
          this.$emit('settingsChanged',newSettings);
        }
      }
    },
    methods: {
      handleMouseOver(event, description) {
        this.tooltipContent = description;

        const elementRect = event.target.getBoundingClientRect();
        const tooltipWidth = 280;
        const gap = 20;

        let leftPos = elementRect.left - tooltipWidth - gap;

        if (leftPos < 0) {
          leftPos = gap; 
        }

        const topPos = elementRect.top + window.scrollY + (elementRect.height / 2) - 50;

        this.tooltipPosition = { left: leftPos, top: topPos };
        this.isTooltipVisible = true;
              },

      handleMouseLeave() {
        this. isTooltipVisible = false;
      }
    }
  };
  </script>
  
<style scoped>
  .settings-panel {
    max-height: clamp(400px, 80vh, 600px); 
    overflow-y: auto; 
    display: flex;
    flex-direction: column;
    padding: 10px;
    width: 100%; 
    box-sizing: border-box;
  }
  .setting {
    display: flex;
    flex-direction: column;
    align-items: flex-start; 
    margin-bottom: 10px;
    font-family: 'Sohne', sans-serif; 
  }

  .input-group{
    display: flex;
    justify-content: space-between;
    width:100%;
    line-height: 15px;
  }
  .setting label, .setting input, .setting select {
    font-size: clamp(12px, 1.5vh, 14px); 
  }

  .setting-content {
    display: flex;
    justify-content: space-between;
    align-items: center; 
    width: 100%; 
  }

  .toggle-switch {
    -webkit-appearance: none;
    appearance: none;
    width: 40px; 
    height: 20px; 
    background: #ddd; 
    border-radius: 20px; 
    position: relative;
    cursor: pointer;
    outline: none; 
    transition: background 0.3s ease-in-out; 
  }

  .toggle-switch:checked {
    background: #4CAF50; 
  }

  .toggle-switch::after {
    content: '';
    position: absolute;
    top: 2px; 
    left: 2px; 
    width: 16px; 
    height: 16px; 
    background: white; 
    border-radius: 50%; 
    transition: transform 0.3s ease-in-out; 
  }

  .toggle-switch:checked::after {
    transform: translateX(20px); 
  }

  .setting input[type=number] {
    align-self: flex-end;
    width: 60px;
    padding: 4px 5px 3px;
    text-align: right;
    font-variant: tabular-nums;
    background: transparent; 
    border: 1px solid transparent;
    box-sizing: border-box; 
    -moz-appearance: textfield; 
  }
  .setting:hover input[type=number] {
    border: 1px solid #c5c5d2;
    border-radius: 8px;
    font-weight: 400;
    margin: 0;
  } 

  .setting #model {
    width: 100%; 
    border-radius: 8px; 
    padding: 4px;
    margin-top: 10px; 
    border: 1px solid #c5c5d2; 
    -webkit-appearance: none; 
    -moz-appearance: none; 
    appearance: none; 
    background-color: white; 
    cursor: pointer;
  }

  .setting #model:focus {
    outline: none; 
    border-color: #a0a0a5; 
  }
  .setting input[type=range] {
    margin-top: 3px;
    -webkit-appearance: none; 
    width: 100%; 
    background: transparent; 
  }
  /* Styles for the slider thumb (the part you drag) */
  .setting input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 1.2rem; /* Adjust as needed */
    height: 1.2rem; /* Adjust as needed */
    background: #FFFFFF; /* Light gray color */
    border: 2px solid #BFBFBF;
    cursor: pointer; /* Makes it clear the thumb is draggable */
    border-radius: 50%; /* Circular thumb */
    box-sizing: border-box;
    margin-top: -5px;
  }

  /* Styles for the slider track (the background of the slider) */
  .setting input[type=range]::-webkit-slider-runnable-track {
    width: 100%;
    height: 0.5rem; /* Adjust as needed */
    background: #D3D3D3; /* Lighter gray color for the track */
    border-radius: 4px; /* Slightly rounded corners for the track */
  }

  /* Firefox styles for the thumb */
  .setting input[type=range]::-moz-range-thumb {
    width: 20px; /* Adjust as needed */
    height: 20px; /* Adjust as needed */
    background: #BFBFBF;
    cursor: pointer;
    border-radius: 50%;
  }

  /* Firefox styles for the track */
  .setting input[type=range]::-moz-range-track {
    width: 100%;
    height: 8px; /* Adjust as needed */
    background: #D3D3D3;
    border-radius: 4px;
  }

  /* Styles for the thumb in IE & Edge */
  .setting input[type=range]::-ms-thumb {
    width: 20px; /* Adjust as needed */
    height: 20px; /* Adjust as needed */
    background: #BFBFBF;
    cursor: pointer;
    border-radius: 50%;
  }

  /* Styles for the track in IE & Edge */
  .setting input[type=range]::-ms-track {
    width: 100%;
    height: 8px; /* Adjust as needed */
    background: #D3D3D3;
    border-radius: 4px;
  }

  /* Additional styles for IE & Edge to remove default track background */
  .setting input[type=range]::-ms-fill-lower,
  .setting input[type=range]::-ms-fill-upper {
    background: transparent;
  }
</style>
  