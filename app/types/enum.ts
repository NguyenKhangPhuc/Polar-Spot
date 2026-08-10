export enum EVENT_STATUS {
    ONGOING = 'ongoing',
    FINISHED = 'finished',
}

export enum INVITATION_STATUS {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected'
}

export enum PROFILE_ROLE {
    ADMIN = 'admin',
    STUDENT = 'student',
    JUDGES = 'judge'
}


export enum UNIVERSITY {
    OULU_UNI = 'University of Oulu',
    OAMK = 'Oulu University of Applied Science'
}

export enum PROGRAMME {
    CSE = 'Computer Science and Engineering',
    ECE = 'Electronics and Communications Engineering',
    IPS = 'Information Processing Science',
    BE = 'Biomedical Engineering'
}

export enum YEAR {
    FIRST = 'First Year',
    SECOND = 'Second Year',
    THIRD = 'Third Year',
    FOURTH = 'Fourth Year'
}

export enum DEGREE {
    BACHELOR = 'Bachelor',
    MASTER = 'Master',
    PHD = 'Ph.D'
}

export enum AUTH_ERROR_CODE {
    INVALID_CREDENTIALS = 'invalid_credentials',
    EMAIL_NOT_CONFIRMED = 'email_not_confirmed',
    EXISTED_USER = 'user_already_exists',
}

export enum CRITERIA_TYPE {
    NORMAL = 'normal',
    SPECIFIC = 'specific',
}

export enum PROJECT_STATUS {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected'
}

export enum AWARD_TYPE {
    GENERAL = 'general',
    SPECIFIC = 'specific',
    PARTICIPANT = 'participant'
}