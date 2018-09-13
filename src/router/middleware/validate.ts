export function validate(validationMap: Core.RequestValidationMap, settings) {
  return (req: Express.Request, res: Express.Response, next) => {
    const isValid = Object.keys(validationMap).every(reqKey =>
      validateObject(req[reqKey], validationMap[reqKey]),
    )
    if (isValid) {
      next()
    } else if (settings.nextOnFail) {
      next('route')
    } else {
      res.status(400).send({ success: false, reason: 'Bad_Request' })
    }
  }
}

function validateObject(input: object, validationMap: Core.ValidationMap): boolean {
  return Object.keys(validationMap).every(param =>
    validateElement(input[param], validationMap[param]),
  )
}

function validateElement(input, validationInfo: Core.ValidationInfo): boolean {
  switch (validationInfo.type) {
    case REGEXP:
      if (!input || !input.toString) return validationInfo.allowUndefined
      return validateRegex(input.toString(), validationInfo.regexp)
    case ONEOF:
      if (!input || !input.toString) return validationInfo.allowUndefined
      return validateOneOf(input.toString(), validationInfo.list)
  }
}

const REGEXP = 'REGEXP'
function validateRegex(input: string, regexp: RegExp) {
  return regexp.test(input)
}

const ONEOF = 'ONEOF'
function validateOneOf(input: string, list: string[]) {
  return list.includes(input)
}

export function regexpValidator(regexp: RegExp, allowUndefined = false): Core.ValidationInfo {
  return {
    type: REGEXP,
    regexp,
    allowUndefined,
  }
}

export function oneOfValidator(list: string[], allowUndefined = false): Core.ValidationInfo {
  return {
    type: ONEOF,
    list,
    allowUndefined,
  }
}
