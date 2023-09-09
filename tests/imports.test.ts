describe('import vue components', () => {
    test('normal imports as expected', async () => {
        const cmp = await import ('../components/content/InfoBox.vue')
        expect(cmp).toBeDefined()
    })
    test('dynamic imports as expected', async () => {
        const name = 'InfoBox1'
        const cmp = await import (`../components/content/${name}.vue`)
        expect(cmp).toBeDefined()
    })
})