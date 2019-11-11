import { createStateLink, useStateLink } from '@hookstate/core';

const state = createStateLink({
    isEditableInline: true,
    isScopedUpdateEnabled: true,
    isHighlightUpdatesEnabled: true
})

export function useSettingsState() {
    return useStateLink(state, s => ({
        get isEditableInline() {
            return s.nested.isEditableInline.get()
        },
        toogleEditableInline() {
            s.nested.isEditableInline.set(p => !p)
        },
        get isScopedUpdateEnabled() {
            return s.nested.isScopedUpdateEnabled.get()
        },
        toogleScopedUpdate() {
            s.nested.isScopedUpdateEnabled.set(p => !p)
        },
        get isHighlightUpdateEnabled() {
            return s.nested.isHighlightUpdatesEnabled.get()
        },
        toogleHighlightUpdate() {
            s.nested.isHighlightUpdatesEnabled.set(p => !p)
        }
    }))
}
