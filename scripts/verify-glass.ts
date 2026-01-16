import fs from 'fs'
import path from 'path'

// Adjust standard path relative to execution root or just hardcode src location
const srcDir = './src'  // Assuming run from project root (apps/desktop or main root? Project seems to run from root in npm scripts)

// Mapping generic path for tool usage inside workspace
// If run from root, src is src.
// If run from apps/desktop, src is ../../src

const glassPatterns = [
    /glass-perfect/g,
    /glass-low/g,
    /glass-medium/g,
    /glass-high/g,
    /card-glass/g,
    /panel-glass/g,
    /button-glass/g,
    /modal-glass/g,
    /input-glass/g
]

interface FileCheck {
    file: string
    hasGlass: boolean
    count: number
    components: string[]
}

function checkGlassInFiles(dir: string): FileCheck[] {
    const results: FileCheck[] = []

    if (!fs.existsSync(dir)) {
        console.warn(`Directory not found: ${dir}`)
        return []
    }

    const files = fs.readdirSync(dir)

    files.forEach(file => {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)

        if (stat.isDirectory()) {
            if (!['node_modules', '.git', 'dist', '.vite', 'build'].includes(file)) {
                results.push(...checkGlassInFiles(filePath))
            }
        } else if (file.endsWith('.tsx') || file.endsWith('.css') || file.endsWith('.jsx')) {
            const content = fs.readFileSync(filePath, 'utf-8')
            const allMatches: string[] = []

            glassPatterns.forEach(pattern => {
                const matches = content.match(pattern) || []
                allMatches.push(...matches)
            })

            if (allMatches.length > 0) {
                const uniqueClasses = [...new Set(allMatches)]
                results.push({
                    file: filePath,
                    hasGlass: true,
                    count: allMatches.length,
                    components: uniqueClasses
                })
            }
        }
    })

    return results
}

function generateReport() {
    console.log('\n' + '═'.repeat(80))
    console.log('🔍 TYPINGPRO - GLASS BLUR SYSTEM VERIFICATION REPORT')
    console.log('═'.repeat(80) + '\n')

    // Scan both shared src and apps/desktop/src
    // Scan both shared src and apps/desktop/src
    const sharedSrc = 'src'
    const desktopSrc = 'apps/desktop/src'

    let results = checkGlassInFiles(sharedSrc)
    const desktopResults = checkGlassInFiles(desktopSrc)
    results = results.concat(desktopResults)

    if (results.length === 0) {
        console.log('❌ ERROR: No glass blur classes found in codebase!')
        console.log('   Please add .glass-perfect or related classes to your components.\n')
        process.exit(1)
    }

    let totalCount = 0
    const componentTypes: { [key: string]: number } = {}

    // Sort by count desc
    results.sort((a, b) => b.count - a.count)

    results.forEach(({ file, count, components }) => {
        console.log(`✅ ${file}`)
        console.log(`   └─ Glass instances: ${count}`)
        // components.forEach(comp => {
        //   console.log(`      • ${comp}`)
        //   componentTypes[comp] = (componentTypes[comp] || 0) + 1
        // })
        totalCount += count
        console.log('')

        components.forEach(comp => {
            componentTypes[comp] = (componentTypes[comp] || 0) + 1
        })
    })

    console.log('═'.repeat(80))
    console.log('📊 SUMMARY')
    console.log('═'.repeat(80))
    console.log(`✅ Files checked with glass: ${results.length}`)
    console.log(`✅ Total glass instances: ${totalCount}`)
    console.log(`✅ Component types used:`)
    Object.entries(componentTypes).forEach(([comp, count]) => {
        console.log(`   • ${comp}: ${count}`)
    })

    // We expect roughly 20+ instances across the updated files
    const minExpected = 20
    if (totalCount < minExpected) {
        console.log(`\n⚠️  WARNING: Found ${totalCount} instances, expected at least ${minExpected}. Ensure rollout is complete.`)
    } else {
        console.log(`\n✅ Glass blur system is properly integrated!`)
    }

    console.log('═'.repeat(80) + '\n')
}

generateReport()
