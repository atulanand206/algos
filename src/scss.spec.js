import { resolve } from 'path'
import { runSass } from 'sass-true'
import { sync } from 'glob'

describe('Sass', () => {
  // Find all of the Sass files that end in `*.spec.scss` in any directory of this project.
  // I use path.resolve because True requires absolute paths to compile test files.
  const sassTestFiles = sync(resolve(process.cwd(), 'src/**/*.spec.scss'))
 
  // Run True on every file found with the describe and it methods provided
  sassTestFiles.forEach(file =>
    runSass({ file }, { describe, it })
  )
})