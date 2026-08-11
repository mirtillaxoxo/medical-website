<script setup lang="ts">
import {
  colorsPrimary,
  colorsSecondary,
  colorsDark,
} from '~~/shared/utils/colors'

const { primary, secondary, dark, setColor } = useThemeColors()

const renderButtons = (
  colors: string[],
  type: 'primary' | 'secondary' | 'dark',
  selected: string,
) => {
  return colors.map((color) => ({
    color,

    isSelected: color === selected,

    onClick: () => {
      setColor(type, color)
    },
  }))
}
</script>

<template>
  <div class="p-3 flex flex-col gap-4">
    <!-- PRIMARY -->

    <div class="flex items-center">
      <span class="mr-2 font-bold"> Primary: </span>

      <div class="flex gap-1">
        <button
          v-for="btn in renderButtons(colorsPrimary, 'primary', primary)"
          :key="btn.color"
          class="w-8 h-8 rounded-md border transition"
          :class="btn.isSelected ? 'border-black' : 'border-gray-300'"
          :style="{
            backgroundColor: btn.color,
          }"
          @click="btn.onClick"
        />
      </div>
    </div>

    <!-- SECONDARY -->

    <div class="flex items-center">
      <span class="mr-2 font-bold"> Secondary: </span>

      <div class="flex gap-1">
        <button
          v-for="btn in renderButtons(colorsSecondary, 'secondary', secondary)"
          :key="btn.color"
          class="w-8 h-8 rounded-md border transition"
          :class="btn.isSelected ? 'border-black' : 'border-gray-300'"
          :style="{
            backgroundColor: btn.color,
          }"
          @click="btn.onClick"
        />
      </div>
    </div>

    <!-- DARK -->

    <div class="flex items-center">
      <span class="mr-2 font-bold"> Dark: </span>

      <div class="flex gap-1">
        <button
          v-for="btn in renderButtons(colorsDark, 'dark', dark)"
          :key="btn.color"
          class="w-8 h-8 rounded-md border transition"
          :class="btn.isSelected ? 'border-black' : 'border-gray-300'"
          :style="{
            backgroundColor: btn.color,
          }"
          @click="btn.onClick"
        />
      </div>
    </div>
  </div>
</template>
