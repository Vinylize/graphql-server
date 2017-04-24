const category = {
  node: {
    0: {
      detail: {
        0: {
          name: '전체'
        },
        1: {
          name: '세븐일레븐'
        },
        2: {
          name: 'CU'
        },
        3: {
          name: 'GS25'
        },
        4: {
          name: '미니스톱'
        },
        999: {
          name: '기타'
        }
      },
      name: '편의점'
    },
    1: {
      detail: {
        0: {
          name: '전체'
        },
        1: {
          name: '한식'
        },
        2: {
          name: '일식'
        },
        3: {
          name: '중식'
        },
        999: {
          name: '기타'
        }
      },
      name: '음식점'
    },
    999: {
      name: '기타'
    }
  },
  delivery: {
    0: {
      name: '기타'
    },
    1: {
      name: '구매배송'
    },
    2: {
      name: '사용자지정배송'
    },
  },
  runner: {
    0: {
      name: '기타'
    },
    1: {
      name: '도보'
    },
    2: {
      name: '자전거'
    },
    3: {
      name: '오토바이'
    },
    4: {
      name: '차량'
    },
  },
  orderStatus: {
    0: {
      name: '러너 매칭 중'
    },
    1: {
      name: '러너 매칭 실패'
    },
    2: {
      name: '배달 중'
    },
    3: {
      name: '배달 완료'
    },
    4: {
      name: '배달 취소'
    },
  }
};


export default {
  node: category.node,
  delivery: category.delivery,
  runner: category.runner,
  orderStatus: category.orderStatus
};
