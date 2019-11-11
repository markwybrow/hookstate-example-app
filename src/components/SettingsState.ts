import { createStateLink, useStateLink } from '@hookstate/core';

const state = createStateLink({ isEditableInline: false, isScopedUpdate: true })

export function useSettingsState() {
    return useStateLink(state, s => ({
        get isEditableInline() {
            return s.nested.isEditableInline.get()
        },
        toogleEditableInline() {
            s.nested.isEditableInline.set(p => !p)
        },
        get isScopedUpdate() {
            return s.nested.isScopedUpdate.get()
        },
        toogleScopedUpdate() {
            s.nested.isScopedUpdate.set(p => !p)
        }
    }))
}
