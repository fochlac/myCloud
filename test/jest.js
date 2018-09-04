import * as unexpected from 'unexpected'
import * as unexpectedImmutable from 'unexpected-immutable'
import * as unexpectedSinon from 'unexpected-sinon'

import Adapter from 'enzyme-adapter-react-16'
import Enzyme from 'enzyme'
import configureEnvironment from '../src/config'

configureEnvironment()

global.secretKey = '1234567890'

Enzyme.configure({ adapter: new Adapter() })

unexpected.use(unexpectedSinon)
unexpected.use(unexpectedImmutable)
